const axios = require('axios');

exports.placeDetails = async (req, res) => { 
    const placeId = req.query.placeId;

    if (!placeId) {
        return res.status(400).json({ error: 'placeId is required' });
    }

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
            params: {
                place_id: placeId,
                key: 'AIzaSyAhhiH3PrL9td9IGJWfpK3CXnU3gtsIYHY',
            },
        });
 
        const location = response.data.result.geometry.location;
        res.json({ location });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch place details' });
    }
}