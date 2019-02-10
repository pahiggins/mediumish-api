/* eslint-disable consistent-return */
const connection = require('../../db/connection');

exports.getTopics = (req, res, next) => connection('topics')
  .select('*')
  .then((allTopics) => {
    if (allTopics.length === 0) return Promise.reject({ status: 404, msg: 'topic not found' });
    res.status(200).send({ topics: allTopics });
  })
  .catch(next);

exports.addTopic = (req, res, next) => {
  let slug;
  let description;

  if (typeof req.body.slug === 'string') {
    slug = req.body.slug.trim();
  }

  if (typeof req.body.description === 'string') {
    description = req.body.description.trim();
  }

  const newTopic = {
    slug,
    description,
  };

  return connection('topics')
    .insert(newTopic)
    .returning(['slug', 'description'])
    .then(([addedTopic]) => {
      if (!addedTopic) return Promise.reject({ status: 404, msg: 'topic not found' });
      res.status(201).send({ topic: addedTopic });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.params;
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 1,
    sort_ascending = false,
  } = req.query;

  console.log('Limit', limit);

  return connection
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .limit(limit)
    .offset((p - 1) * limit)
    .count('comments.article_id AS comment_count')
    .orderBy(`${sort_by}`, sort_ascending ? 'asc' : 'desc')
    .where('topic', '=', topic)
    .from('comments')
    .leftJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .groupBy(
      'articles.username',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'comments.article_id',
    )
    .then((matchingArticles) => {
      if (matchingArticles.length === 0) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send({ articles: matchingArticles });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  let title;
  let body;
  let username;
  const { topic } = req.params;

  if (typeof req.body.title === 'string') {
    title = req.body.title.trim();
  }

  if (typeof req.body.body === 'string') {
    body = req.body.body.trim();
  }

  if (typeof req.body.username === 'string') {
    username = req.body.username.trim();
  }

  const newArticle = {
    title,
    body,
    username,
    topic,
  };

  return connection('articles')
    .insert(newArticle)
    .returning('*')
    .then(([addedArticle]) => {
      if (!addedArticle) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(201).send({ article: addedArticle });
    })
    .catch(next);
};
