const express = require('express');
const { fetchCategories, createCategory } = require('../controllers/Category');

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: All Categories List
 *     tags: [Fetch-Details]
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                   example: smartphones
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 */

router.get('/', fetchCategories).post('/', createCategory);

exports.router = router;