const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from anywhere (you can restrict later to your React domain)
app.use(cors());
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
  res.send("🚀 Job backend is running on Railway");
});

app.get('/api/jobs', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Must be set in Railway Variables
        },
    };

    try {
        console.log(`Fetching jobs for query: ${query}`);
        const apiResponse = await fetch(url, options);
        const data = await apiResponse.json();

        if (data.data) {
            res.json(data.data);
        } else {
            console.error('Error from JSearch API:', data);
            res.status(500).json({ message: 'Error from JSearch API' });
        }
    } catch (error) {
        console.error('Proxy server error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
