import { Router, Request, Response } from 'express';
import aiService from '../services/aiService';
import { validateGenerateResponses } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import crypto from 'crypto';
import { dbAll, dbRun } from '../utils/database';

const router = Router();

// Generate responses
router.post('/generate-responses', validateGenerateResponses, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { context, opponentPosition, userPosition, tone, styleExamples, argumentId } = req.body;
  
  try {
    // Generate AI responses
    const responses = await aiService.generateResponses({
      context,
      opponentPosition,
      userPosition,
      tone,
      styleExamples
    });
    
    // If argumentId provided, save responses to database
    if (argumentId) {
      const responsePromises = responses.map((content) => {
        const id = crypto.randomUUID();
        return dbRun(
          'INSERT INTO responses (id, argument_id, content, tone) VALUES (?, ?, ?, ?)',
          [id, argumentId, content, tone]
        );
      });
      
      try {
        await Promise.all(responsePromises);
      } catch (dbError) {
        console.error('Error saving responses to database:', dbError);
        // Continue even if saving fails
      }
    }
    
    res.json({
      success: true,
      responses,
      argumentId
    });
  } catch (error) {
    console.error('Error generating responses:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AI_ERROR',
        message: 'Failed to generate responses. Please try again.'
      }
    });
  }
}));

// Get responses for an argument
router.get('/arguments/:argumentId/responses', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { argumentId } = req.params;
  
  try {
    const rows = await dbAll(
      'SELECT * FROM responses WHERE argument_id = ? ORDER BY generated_at DESC',
      [argumentId]
    );
    
    res.json({
      success: true,
      responses: rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DB_ERROR', message: 'Failed to fetch responses' }
    });
  }
}));

export default router;