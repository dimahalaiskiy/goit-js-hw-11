import axios from 'axios';

const API_KEY = '24506585-6e38fd61df2df2110dc1b02e0';

const fetchImages = async (value, counter) => {
	return await axios
		.get(
			`https://pixabay.com/api/?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${counter}&per_page=40`,
		)
		.then(obj => obj.data);
};

export default fetchImages;
