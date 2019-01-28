/* eslint-disable consistent-return */
const connection = require('../../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 1,
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
    .offset((p - 1) * limit)
    .count('comments.article_id AS articles.comment_count')
    .orderBy((`articles.${sort_by}`), sort_ascending ? 'asc' : 'desc')
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
    .then((matchingArticles) => {
      if (matchingArticles.length === 0) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send({ articles: matchingArticles });
    })
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
    .then(([matchingArticle]) => {
      if (!matchingArticle) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send({ article: matchingArticle });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== 'number') {
    next({ code: '22P02' });
  }

  return connection('articles')
    .where('article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([updatedArticle]) => {
      if (!updatedArticle) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;

  return connection('articles')
    .where('article_id', '=', article_id)
    .del()
    .then((deletedArticle) => {
      if (deletedArticle === 0) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send({});
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 1,
    sort_ascending = false,
  } = req.query;

  return connection
    .select(
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'articles.username AS author',
      'comments.username',
      'comments.body',
    )
    .where('comments.article_id', '=', article_id)
    .limit(limit)
    .offset((p - 1) * limit)
    .orderBy((`comments.${sort_by}`), sort_ascending ? 'asc' : 'desc')
    .from('comments')
    .leftJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .then((matchingComments) => {
      if (matchingComments.length === 0) {
        return Promise.reject({
          status: 404, msg: 'comment not found',
        });
      }
      res.status(200).send({ comments: matchingComments });
    })
    .catch(next);
};

exports.addComment = (req, res, next) => {
  let username;
  let body;
  const { article_id } = req.params;

  if (typeof req.body.username === 'string') {
    username = req.body.username.trim();
  }

  if (typeof req.body.body === 'string') {
    body = req.body.body.trim();
  }

  const newComment = {
    username,
    body,
    article_id,
  };

  return connection('comments')
    .insert(newComment)
    .returning('*')
    .then(([addedComment]) => {
      if (!addedComment) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(201).send({ comment: addedComment });
    })
    .catch(next);
};

exports.updateComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (typeof inc_votes !== 'number') {
    next({ code: '22P02' });
  }

  return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([updatedComment]) => {
      if (!updatedComment) return Promise.reject({ status: 404, msg: 'comment not found' });
      res.status(200).send({ comment: updatedComment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  return connection('comments')
    .where('comment_id', '=', comment_id)
    .del()
    .then((deletedComment) => {
      if (deletedComment === 0) return Promise.reject({ status: 404, msg: 'comment not found' });
      res.status(200).send({});
    })
    .catch(next);
};
