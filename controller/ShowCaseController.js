import {
    Showcase
} from '../models/ShowCase.js';

const getShowcaseItems = async (req, res) => {
    try {
        const showcaseItems = await Showcase.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.send(showcaseItems);
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred when trying to fetch showcase items.'
        });
    }
};

const createShowcaseItem = async (req, res) => {
    try {
        if (req.user.priority === 1) {
            const showcase = await Showcase.create(req.body);
            res.send(showcase);
        } else {
            return res.status(403).send({
                error: "You don't have permission to create a showcase item."
            });
        }
    } catch (err) {
        res.status(500).send({
            error: "An error occurred when trying to create a showcase item."
        });
    }
};

const updateShowcaseItem = async (req, res) => {
    try {
        if (req.user.priority === 1) {
            await Showcase.update(req.body, {
                where: {
                    id: req.body.id
                }
            });
        } else {
            return res.status(403).send({
                error: "You don't have permission to update a showcase item."
            });
        }
        res.send(req.body);
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred when trying to update a showcase item.'
        });
    }
};

const deleteShowcaseItem = async (req, res) => {
    try {
        if (req.user.priority === 1) {
            await Showcase.destroy({
                where: {
                    id: req.params.showcaseItemId
                }
            });
            res.send({
                id: req.params.showcaseItemId
            });
        } else {
            return res.status(403).send({
                error: "You don't have permission to delete a showcase item."
            });
        }
    } catch (err) {
        res.status(500).send({
            error: 'An error occurred when trying to delete a category.'
        });
    }
};

export default {
    getShowcaseItems,
    createShowcaseItem,
    updateShowcaseItem,
    deleteShowcaseItem
};
