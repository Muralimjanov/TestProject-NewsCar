const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const isImagePath = (str) => /^\/images\/[^\/]+\.(jpg|jpeg|png|webp)$/.test(str);

export const auctionsValidate = (data) => {
    const { header, preview, content, date, images, tags, views, strategy } = data;

    if (typeof header !== 'string' || !header.trim()) {
        throw new Error('Header is required string');
    }
    if (!isImagePath(preview)) {
        throw new Error('Invalid preview path format');
    }
    if (typeof content !== 'string' || !content.trim()) {
        throw new Error('Content is required string');
    }
    if (!isValidDate(date)) {
        throw new Error('Date must be YYYY-MM-DD');
    }
    if (!Array.isArray(images) || !images.every(isImagePath)) {
        throw new Error('Invalid images format');
    }
    if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string' && tag.length <= 15)) {
        throw new Error('Invalid tags');
    }
    if (typeof views !== 'number') {
        throw new Error('Views must be a number');
    }
    if (typeof strategy !== 'string' || strategy.length > 70) {
        throw new Error('Invalid strategy');
    }

    return true;
};