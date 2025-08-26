module.exports = function imageUrlPlugin(schema, options = {}) {
    const { folder = '', fields = ['image'] } = options; // default field is 'image'

    const setImageUrl = (doc) => {
        fields.forEach(field => {
            if (doc[field]) {
                const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`;
                doc[field] = `${baseUrl}/${folder}/${doc[field]}`;
            }
        });
    };

    // post hooks for  findeOne, findAll, update and create
    schema.post('init', setImageUrl);
    schema.post('save', setImageUrl);
};
