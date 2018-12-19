const connection = require('../../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 0,
    sort_ascending = false,
  } = req.query;

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
    .offset(p * limit)
    .orderBy((`articles.${sort_by}`), sort_ascending ? 'asc' : 'desc')
    .count('comments.article_id AS comment_count')
    .from('comments')
    .rightJoin('articles', 'articles.article_id', '=', 'comments.article_id')
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
    .then(matchingArticles => res.status(200).send(matchingArticles))
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

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
    .where('articles.article_id', '=', article_id)
    .count('comments.article_id AS comment_count')
    .from('comments')
    .rightJoin('articles', 'articles.article_id', '=', 'comments.article_id')
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
    .then(([matchingArticles]) => res.status(200).send(matchingArticles))
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return connection('articles')
    .where('article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([updatedArticle]) => res.status(200).send(updatedArticle))
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;

  return connection('articles')
    .where('article_id', '=', article_id)
    .del()
    .then(() => res.status(200).send({}))
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 0,
    sort_ascending = false,
  } = req.query;

  return connection
    .select(
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'articles.username AS author',
      'comments.body',
    )
    .where('comments.article_id', '=', article_id)
    .limit(limit)
    .offset(p * limit)
    .orderBy((`comments.${sort_by}`), sort_ascending ? 'asc' : 'desc')
    .from('comments')
    .leftJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .then(matchingComments => res.status(200).send(matchingComments))
    .catch(next);
};

exports.addCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = {
    username: req.body.username.trim(),
    body: req.body.body.trim() || '',
    article_id,
  };

  return connection('comments')
    .insert(newComment)
    .returning('*')
    .then(([addedComment]) => res.status(201).send(addedComment))
    .catch(next);
};
