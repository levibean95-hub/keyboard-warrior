import express from 'express';
import crypto from 'crypto';
import { getDatabase } from '../config/database';
import aiService from '../services/aiService';
import { ToneType } from '../types';

const router = express.Router();

// Create a new conversation
router.post('/', async (req, res) => {
  try {
    const { context, opponentPosition, userPosition, additionalContext, tone, customToneDescription, styleExamples, firstOpponentMessage } = req.body;
    
    console.log('Creating conversation with:', { context, opponentPosition, userPosition, additionalContext, tone, customToneDescription, firstOpponentMessage });
    
    // Support both old (context) and new (positions) formats
    if (!tone) {
      return res.status(400).json({ error: 'Missing required tone field' });
    }
    
    if (!context && (!opponentPosition || !userPosition)) {
      return res.status(400).json({ error: 'Must provide either context or both positions' });
    }

    const db = getDatabase();
    const conversationId = crypto.randomUUID();

    // Create conversation with positions
    const contextToStore = context || `Opponent: ${opponentPosition}\nUser: ${userPosition}${additionalContext ? `\nContext: ${additionalContext}` : ''}`;
    
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO conversations (id, user_id, context, tone, current_tone, custom_tone_description, style_examples, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [conversationId, 'default-user', contextToStore, tone, tone, customToneDescription || null, JSON.stringify(styleExamples || [])],
        (err) => (err ? reject(err) : resolve(null))
      );
    });

    // Only add first opponent message if provided
    let messages: any[] = [];
    if (firstOpponentMessage && firstOpponentMessage.trim()) {
      const messageId = crypto.randomUUID();
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO messages (id, conversation_id, role, content, created_at)
           VALUES (?, ?, ?, ?, datetime('now'))`,
          [messageId, conversationId, 'opponent', firstOpponentMessage],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
      
      messages = [{
        id: messageId,
        role: 'opponent',
        content: firstOpponentMessage,
        createdAt: new Date().toISOString(),
      }];
    }

    return res.json({
      id: conversationId,
      context: contextToStore,
      opponentPosition,
      userPosition,
      additionalContext,
      tone,
      customToneDescription,
      styleExamples,
      messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Get a conversation by ID
router.get('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const db = getDatabase();

    // Get conversation
    const conversation = await new Promise<any>((resolve, reject) => {
      db.get(
        `SELECT * FROM conversations WHERE id = ?`,
        [conversationId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Get messages
    const messages = await new Promise<any[]>((resolve, reject) => {
      db.all(
        `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`,
        [conversationId],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    // Parse positions from context if available
    let opponentPosition, userPosition, additionalContext;
    if (conversation.context && conversation.context.includes('Opponent:') && conversation.context.includes('User:')) {
      const parts = conversation.context.split('\n');
      opponentPosition = parts.find((p: string) => p.startsWith('Opponent:'))?.replace('Opponent:', '').trim();
      userPosition = parts.find((p: string) => p.startsWith('User:'))?.replace('User:', '').trim();
      additionalContext = parts.find((p: string) => p.startsWith('Context:'))?.replace('Context:', '').trim();
    }

    return res.json({
      id: conversation.id,
      context: conversation.context,
      opponentPosition,
      userPosition,
      additionalContext,
      tone: conversation.tone,
      customToneDescription: conversation.custom_tone_description,
      currentTone: conversation.current_tone || conversation.tone,
      styleExamples: JSON.parse(conversation.style_examples || '[]'),
      messages: messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.created_at,
      })),
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    });
  } catch (error) {
    console.error('Error getting conversation:', error);
    return res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// Add a message to a conversation
router.post('/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { role, content } = req.body;
    
    if (!role) {
      return res.status(400).json({ error: 'Missing required role field' });
    }

    const db = getDatabase();

    // Get conversation details
    const conversation = await new Promise<any>((resolve, reject) => {
      db.get(
        `SELECT * FROM conversations WHERE id = ?`,
        [conversationId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if the last message is the same - if so, don't add duplicate
    const lastMessage = await new Promise<any>((resolve, reject) => {
      db.get(
        `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1`,
        [conversationId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    let shouldAddMessage = true;
    if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
      // Message already exists, don't add it again
      shouldAddMessage = false;
    }

    if (shouldAddMessage && content) {
      const messageId = crypto.randomUUID();
      // Add the message
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO messages (id, conversation_id, role, content, created_at)
           VALUES (?, ?, ?, ?, datetime('now'))`,
          [messageId, conversationId, role, content],
          (err) => (err ? reject(err) : resolve(null))
        );
      });

      // Update conversation timestamp
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE conversations SET updated_at = datetime('now') WHERE id = ?`,
          [conversationId],
          (err) => (err ? reject(err) : resolve(null))
        );
      });
    }

    // Get all messages for context
    const messages = await new Promise<any[]>((resolve, reject) => {
      db.all(
        `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`,
        [conversationId],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    let generatedResponses: string[] = [];

    // If opponent just sent a message, generate responses
    if (role === 'opponent') {
      // Build conversation history
      const conversationHistory = messages.map(m => 
        `${m.role === 'opponent' ? 'Opponent' : 'You'}: ${m.content}`
      ).join('\n\n');

      const fullContext = `${conversation.context}\n\nConversation so far:\n${conversationHistory}`;
      
      // Extract positions if stored in context
      let opponentPos, userPos, addContext;
      if (conversation.context && conversation.context.includes('Opponent:') && conversation.context.includes('User:')) {
        const parts = conversation.context.split('\n');
        opponentPos = parts.find((p: string) => p.startsWith('Opponent:'))?.replace('Opponent:', '').trim();
        userPos = parts.find((p: string) => p.startsWith('User:'))?.replace('User:', '').trim();
        addContext = parts.find((p: string) => p.startsWith('Context:'))?.replace('Context:', '').trim();
      }

      generatedResponses = await aiService.generateResponses({
        context: fullContext,
        opponentPosition: opponentPos,
        userPosition: userPos,
        additionalContext: addContext,
        tone: (conversation.current_tone || conversation.tone) as ToneType,
        customToneDescription: conversation.custom_tone_description,
        styleExamples: JSON.parse(conversation.style_examples || '[]'),
      });
    }

    return res.json({
      messages: messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.created_at,
      })),
      generatedResponses,
    });
  } catch (error) {
    console.error('Error adding message:', error);
    return res.status(500).json({ error: 'Failed to add message' });
  }
});

// Update conversation positions and context
router.patch('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { opponentPosition, userPosition, additionalContext } = req.body;
    
    const db = getDatabase();
    
    // Get current conversation
    const conversation = await new Promise<any>((resolve, reject) => {
      db.get(
        `SELECT * FROM conversations WHERE id = ?`,
        [conversationId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Update context with new positions
    const newContext = `Opponent: ${opponentPosition || 'Not specified'}\nUser: ${userPosition || 'Not specified'}${additionalContext ? `\nContext: ${additionalContext}` : ''}`;
    
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE conversations SET context = ?, updated_at = datetime('now') WHERE id = ?`,
        [newContext, conversationId],
        (err) => (err ? reject(err) : resolve(null))
      );
    });
    
    // Get messages for response
    const messages = await new Promise<any[]>((resolve, reject) => {
      db.all(
        `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`,
        [conversationId],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
    
    return res.json({
      id: conversation.id,
      context: newContext,
      opponentPosition,
      userPosition,
      additionalContext,
      tone: conversation.tone,
      currentTone: conversation.current_tone || conversation.tone,
      styleExamples: JSON.parse(conversation.style_examples || '[]'),
      messages: messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.created_at,
      })),
      createdAt: conversation.created_at,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Change the tone/style of a conversation
router.patch('/:conversationId/tone', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { tone } = req.body;
    
    if (!tone) {
      return res.status(400).json({ error: 'Missing required tone field' });
    }
    
    const db = getDatabase();
    
    // Get current conversation
    const conversation = await new Promise<any>((resolve, reject) => {
      db.get(
        `SELECT * FROM conversations WHERE id = ?`,
        [conversationId],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const oldTone = conversation.current_tone || conversation.tone;
    
    // Get message count for this conversation
    const messageCount = await new Promise<number>((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count FROM messages WHERE conversation_id = ?`,
        [conversationId],
        (err, row: any) => (err ? reject(err) : resolve(row.count))
      );
    });
    
    // Record the style change
    const changeId = crypto.randomUUID();
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO style_changes (id, conversation_id, from_tone, to_tone, message_count, changed_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        [changeId, conversationId, oldTone, tone, messageCount],
        (err) => (err ? reject(err) : resolve(null))
      );
    });
    
    // Update the conversation's current tone
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE conversations SET current_tone = ?, updated_at = datetime('now') WHERE id = ?`,
        [tone, conversationId],
        (err) => (err ? reject(err) : resolve(null))
      );
    });
    
    // Get style change history
    const styleHistory = await new Promise<any[]>((resolve, reject) => {
      db.all(
        `SELECT * FROM style_changes WHERE conversation_id = ? ORDER BY changed_at DESC`,
        [conversationId],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
    
    return res.json({
      id: conversationId,
      currentTone: tone,
      previousTone: oldTone,
      styleHistory: styleHistory.map(s => ({
        id: s.id,
        fromTone: s.from_tone,
        toTone: s.to_tone,
        messageCount: s.message_count,
        changedAt: s.changed_at,
      })),
    });
  } catch (error) {
    console.error('Error changing conversation tone:', error);
    return res.status(500).json({ error: 'Failed to change conversation tone' });
  }
});

export default router;