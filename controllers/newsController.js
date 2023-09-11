const News = require('../models/News');
const {StatusCodes} = require("http-status-codes");

class newsController {

  async create(req, res) {
    try {
      const {title, description, author} = req.body;

      const candidate = await News.findOne({ title });
      if (candidate) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Така новина вже існує' })
      }

      const news = new News({
        title,
        description,
        author
      });
    await news.save();
    return res.status(StatusCodes.OK).json({ message: 'Новина успішно створена' })
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Creation error' })
    }
  }

  async getAll(req, res) {
    try {
      const news = await News.find();
      res.status(StatusCodes.OK).json({news});
    } catch (error) {
      console.log(error);
    }
  }

  async get(req, res) {
    const id = req.params.id;

    try {
      const news = await News.findOne({_id: id});
      if (!news) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'Новина не знайдена'})
      }
      res.json({news});
    } catch (error) {
       console.log(error);
    }
  }

  async update(req, res) {
    const id = req.params.id;
    try {
      const news = await News.findOne({_id: id});
      if (!news) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'Новина не знайдена'})
      }

      const { title, description, author } = req.body;
      const result = await News.updateOne({_id: id}, {title, description, author});
      res.status(StatusCodes.OK).json(result);

    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    try {
      const result = await News.deleteOne({ _id: id });
      console.log('result', result);

      if (result.deletedCount === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'Новина не знайдена'})
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.log(error)
    }
  };
}

module.exports = new newsController();
