const express = require('express');
const { fetchBrands, createBrand } = require('../controllers/Brand');

const router = express.Router();


/**
 * @swagger
 * /brands:
 *   get:
 *     summary: All Brands List
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
 *                   example: Apple
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
router.get('/', fetchBrands).post('/', createBrand);

exports.router = router;