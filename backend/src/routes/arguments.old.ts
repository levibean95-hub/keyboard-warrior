import { Router, Request, Response } from 'express';
import { getDatabase } from '../config/database';
import { validateCreateArgument, validateArgumentId } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import crypto from 'crypto';

const router = Router();

// Get all arguments
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const db = getDatabase();
  const userId = req.headers['user-id'] as string;
  
  db.all(
    'SELECT * FROM arguments WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: { code: 'DB_ERROR', message: 'Failed to fetch arguments' }
        });
      }
      
      const args = rows.map((row: any) => ({
        ...row,
        styleExamples: row.style_examples ? JSON.parse(row.style_examples) : []
      }));
      
      res.json({ success: true, arguments: args });
    }
  );
}));

// Get single argument
router.get('/:id', validateArgumentId, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM arguments WHERE id = ?',
    [id],
    (err, row: any) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: { code: 'DB_ERROR', message: 'Failed to fetch argument' }
        });
      }
      
      if (!row) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Argument not found' }
        });
      }
      
      const argument = {
        ...row,
        styleExamples: row.style_examples ? JSON.parse(row.style_examples) : []
      };
      
      // Fetch associated responses
      db.all(
        'SELECT * FROM responses WHERE argument_id = ? ORDER BY generated_at DESC',
        [id],
        (err, responses) => {
          if (err) {
            return res.status(500).json({
              success: false,
              error: { code: 'DB_ERROR', message: 'Failed to fetch responses' }
            });
          }
          
          res.json({
            success: true,
            argument: { ...argument, responses }
          });
        }
      );
    }
  );
}));

// Create argument
router.post('/', validateCreateArgument, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const db = getDatabase();
  const { title, context, tone, styleExamples } = req.body;
  const userId = req.headers['user-id'] as string;
  const id = crypto.randomUUID();
  
  db.run(
    `INSERT INTO arguments (id, user_id, title, context, tone, style_examples)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      userId || null,
      title || `Argument ${Date.now()}`,
      context,
      tone,
      JSON.stringify(styleExamples || [])
    ],
    function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          error: { code: 'DB_ERROR', message: 'Failed to create argument' }
        });
      }
      
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
    }
  );
}));

// Delete argument
router.delete('/:id', validateArgumentId, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.run(
    'DELETE FROM arguments WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          error: { code: 'DB_ERROR', message: 'Failed to delete argument' }
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Argument not found' }
        });
      }
      
      res.json({ success: true });
    }
  );
}));

export default router;