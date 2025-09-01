import { Router, Request, Response } from 'express';
import { validateCreateArgument, validateArgumentId } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import crypto from 'crypto';
import { dbAll, dbGet, dbRun } from '../utils/database';

const router = Router();

// Get all arguments
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.headers['user-id'] as string;
  
  try {
    const rows = await dbAll(
      'SELECT * FROM arguments WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC',
      [userId]
    );
    
    const args = rows.map((row: any) => ({
      ...row,
      styleExamples: row.style_examples ? JSON.parse(row.style_examples) : []
    }));
    
    res.json({ success: true, arguments: args });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DB_ERROR', message: 'Failed to fetch arguments' }
    });
  }
}));

// Get single argument
router.get('/:id', validateArgumentId, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const row = await dbGet('SELECT * FROM arguments WHERE id = ?', [id]);
    
    if (!row) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Argument not found' }
      });
      return;
    }
    
    const argument = {
      ...row,
      styleExamples: row.style_examples ? JSON.parse(row.style_examples) : []
    };
    
    const responses = await dbAll(
      'SELECT * FROM responses WHERE argument_id = ? ORDER BY generated_at DESC',
      [id]
    );
    
    res.json({
      success: true,
      argument: { ...argument, responses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DB_ERROR', message: 'Failed to fetch argument' }
    });
  }
}));

// Create argument
router.post('/', validateCreateArgument, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, context, tone, styleExamples } = req.body;
  const userId = req.headers['user-id'] as string;
  const id = crypto.randomUUID();
  
  try {
    await dbRun(
      `INSERT INTO arguments (id, user_id, title, context, tone, style_examples)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId || null,
        title || `Argument ${Date.now()}`,
        context,
        tone,
        JSON.stringify(styleExamples || [])
      ]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id,
        userId,
        title: title || `Argument ${Date.now()}`,
        context,
        tone,
        styleExamples: styleExamples || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DB_ERROR', message: 'Failed to create argument' }
    });
  }
}));

// Delete argument
router.delete('/:id', validateArgumentId, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  try {
    const result = await dbRun('DELETE FROM arguments WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Argument not found' }
      });
      return;
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'DB_ERROR', message: 'Failed to delete argument' }
    });
  }
}));

export default router;