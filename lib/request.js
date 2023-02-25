const axiso = require('axios')

axiso.interceptors.response.use(res => res.data)


async function fetchRepoList() {
  return axiso.get('https://api.github.com/orgs/jiaoyun-cli/repos')
} 

module.exports = {
  fetchRepoList
}