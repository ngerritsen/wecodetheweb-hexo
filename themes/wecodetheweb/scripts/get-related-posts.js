function getRelatedPosts () {
  const relatedPosts = []
  const existingPosts = []
  const currentPost = this.post

  const tagNames = currentPost.tags.map((tag) => tag.name)

  currentPost.tags.each((tag) => {
    tag.posts.each((post) => {
      if (post.id !== currentPost.id) {
        relatedPosts.push(post)
      }
    })
  })

  function postExists (post) {
    const found = existingPosts.filter((existingPost) => post === existingPost)

    existingPosts.push(post)

    return found.length > 0
  }

  const uniqueRelatedPosts = relatedPosts.filter((post) => {
    return !postExists(post)
  })

  const uniqueRelatedPostsScored = uniqueRelatedPosts.map((relatedPost) => {
    const tagScore = relatedPost.tags.reduce((score, tag) => {
      const matches = tagNames.filter((tagName) => tagName === tag.name)

      return matches.length > 0 ? ++score : score
    }, 0)

    return Object.assign(relatedPost, { tagScore: tagScore })
  })

  const uniqueRelatedPostsScoredAndSorted = uniqueRelatedPostsScored
    .sort((a, b) => b.tagScore - a.tagScore)

  return uniqueRelatedPostsScoredAndSorted.splice(0, 3)
}

hexo.extend.helper.register('get_related_posts', getRelatedPosts)
