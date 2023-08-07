const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controllers/Product');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Fetch-Details
 *   description: Get Details Products - Authorization Required
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: All Products List
 *     tags: [Fetch-Details]
*     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort the products based on a specific criteria (e.g., 'name', 'price', 'category')
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (e.g., 1, 2, 3, ...)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page (e.g., 10, 20, 30, ...)
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: json
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 */

router.post("/", createProduct)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductById)
      .patch('/:id', updateProduct)
      ;

exports.router = router;