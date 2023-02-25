
// 获取github组织仓库的接口 https://api.github.com/orgs/jiaoyun-cli/repos

const { fetchRepoList } = require('./request')
const inquirer = require('inquirer') 
const ora = require('ora')
const chalk = require('chalk')
const downLoadGitRepo = require('download-git-repo')
const util = require('util')
const path = require('path')

async function wrapLoading(fn, message) {
  const spinner = ora(chalk.grey(message))
  spinner.start()
  try {
    const res = await fn() 
    spinner.succeed(chalk.green(`success!`))
    return res
  } catch(err) {
    spinner.fail(chalk.red(`加载失败了..., 错误:${err}`))
  } 
}

class Creator {
  constructor(projectName, targetDir) {
    this.name = projectName
    this.target = targetDir
    this.downLoadGitRepo = util.promisify(downLoadGitRepo)
  }

  async fetchRepos() {
    let repos =  await wrapLoading(fetchRepoList, '模版拉取中...')
    if(!repos) return
    repos = repos.map(item => (item.name))
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: '请选择你要下载的项目模版',
        choices: repos,
      }
    ])
    return action
  }

  async download(repo, tag) {
    // jiaoyun/reat-template#1.0
    const requestUrl = `jiaoyun-cli/${repo}${tag ? '#' + tag : ''}`
    // 这里可以进行其它额外配置操作
    const dir = path.resolve(process.cwd(), repo)
    await wrapLoading(() => this.downLoadGitRepo(requestUrl, dir), '模版下载中...')
   
  } 

  async create() {
    // 1 拉取模版
    const repo =  await this.fetchRepos()
     // 2 模版对应的版本号 没有版本就不用写了
    // const tags = await fetchTags(repo)
    // 3 下载到本地
    this.download(repo)
  }
}


module.exports = Creator