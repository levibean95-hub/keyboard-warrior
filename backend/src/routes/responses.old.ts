import { Router, Request, Response } from 'express';
import { getDatabase } from '../config/database';
import aiService from '../services/aiService';
import { validateGenerateResponses } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import crypto from 'crypto';

const router = Router();

// Generate responses
router.post('/generate-responses', validateGenerateResponses, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { context, tone, styleExamples, argumentId } = req.body;
  
  try {
    // Generate AI responses
    const responses = await aiService.generateResponses({
      context,
      tone,
      styleExamples
    });
    
    // If argumentId provided, save responses to database
    if (argumentId) {
      const db = getDatabase();
      const responsePromises = responses.map((content) => {
        return new Promise((resolve, reject) => {
          const id = crypto.randomUUID();
          db.run(
            'INSERT INTO responses (id, argument_id, content, tone) VALUES (?, ?, ?, ?)',
            [id, argumentId, content, tone],
            (err) => {
              if (err) reject(err);
              else resolve({ id, content, tone });
            }
          );
        });
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
  const db = getDatabase();
  const { argumentId } = req.params;
  
  db.all(
    'SELECT * FROM responses WHERE argument_id = ? ORDER BY generated_at DESC',
    [argumentId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: { code: 'DB_ERROR', message: 'Failed to fetch responses' }
        });
      }
      
      res.json({
        success: true,
        responses: rows
      });
    }
  );
}));

export default router;