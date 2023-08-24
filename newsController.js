const News = require('./models/News');

class newsController {

  async create(req, res) {
    try {
      const {title, description, author} = req.body;

      const candidate = await News.findOne({ title });
      if (candidate) {
        return res.status(400).json({ message: 'Така новина вже існує' })
      }

      const news = new News({
        title,
        description,
        author
      });
    await news.save();
    return res.status(200).json({ message: 'Новина успішно створена' })
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Creation error' })
    }
  }

  async getAll(req, res) {
    try {
      const news = await News.find();
      res.json({news});
    } catch (error) {
      console.log(error);
    }
  }

  async get(req, res) {
    const id = req.params.id;

    try {
      const news = await News.findOne({_id: id});
      if (!news) {
        res.status(400).json({message: 'Новина не знайдена'})
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
        res.status(400).json({message: 'Новина не знайдена'})
      }

      const { title, description, author } = req.body;
      const result = await News.updateOne({_id: id}, {title, description, author});
      res.json(result)

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
        res.status(400).json({message: 'Новина не знайдена'})
      }

      res.status(200).json(result);
    } catch (error) {
      console.log(error)
    }
  };
}

module.exports = new newsController();
