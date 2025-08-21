const slugify = require('slugify');

function slugifyPlugin(schema, options = {}) {
    const sourceField = options.sourceField || 'name'; 
    const slugField = options.slugField || 'slug';

    schema.pre('save', function (next) {
        if (this.isModified(sourceField)) {
            this[slugField] = slugify(this[sourceField], { lower: true, strict: true });
        }
        next();
    });

    schema.pre('findOneAndUpdate', function (next) {
        const update = this.getUpdate();
        if (update[sourceField]) {
            update[slugField] = slugify(update[sourceField], { lower: true, strict: true });
            this.setUpdate(update);
        }
        next();
    });
}

module.exports = slugifyPlugin;