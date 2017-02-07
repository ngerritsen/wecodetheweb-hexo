function getRelatedPosts () {
  var relatedPosts = []
  var existingPosts = []
  var currentPost = this.post

  var tagNames = currentPost.tags.map(function (tag) {
    return tag.name
  })

  currentPost.tags.each(function (tag) {
    tag.posts.each(function(post) {
      if (post.id !== currentPost.id) {
        relatedPosts.push(post)
      }
    })
  })

  function postExists (post) {
    var found = existingPosts.filter(function (existingPost) {
      return post === existingPost
    })

    existingPosts.push(post)

    return found.length > 0
  }

  var uniqueRelatedPosts = relatedPosts.filter(function (post) {
    return !postExists(post)
  })

  var uniqueRelatedPostsScored = uniqueRelatedPosts.map(function (relatedPost) {
    var tagScore = relatedPost.tags.reduce(function (score, tag) {
      var matches = tagNames.filter(function (tagName) {
        return tagName === tag.name
      })

      return matches.length > 0 ? ++score : score
    }, 0)

    return Object.assign(relatedPost, { tagScore: tagScore })
  })

  var uniqueRelatedPostsScoredAndSorted = uniqueRelatedPostsScored.sort(function (a, b) {
    return b.tagScore - a.tagScore
  })

  return uniqueRelatedPostsScoredAndSorted.splice(0, 3)
}

hexo.extend.helper.register('get_related_posts', getRelatedPosts)
