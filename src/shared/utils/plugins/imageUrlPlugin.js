module.exports = function imageUrlPlugin(schema, options = {}) {
    const { folder = '', fields = ['image'] } = options;

    const setImageUrl = (doc) => {
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 8000}`;

        fields.forEach((field) => {
            if (!doc[field]) return;

            doc[field] = Array.isArray(doc[field])
                ? doc[field].map((file) => `${baseUrl}/${folder}/${file}`)
                : `${baseUrl}/${folder}/${doc[field]}`;
        });
    };

    schema.post('init', setImageUrl);
    schema.post('save', setImageUrl);
};
