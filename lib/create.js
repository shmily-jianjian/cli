const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const Creator = require('./Creator')
const chalk = require('chalk')

async function create(projectName, options) {
  // 判断项目名是否存在
  const cwd = process.cwd()
  const targetDir = path.join(cwd, projectName)
  if(fs.existsSync(targetDir)) {
    // 判断是否cmd带了-f
    if(options.force) {
      // 先删除目录
      await fs.remove(targetDir)
    } else {
      // 询问是否覆盖
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: '当前目录已存在是否覆盖?',
          choices: [
            {
              name: '覆盖',
              value: true
            },
            {
              name: '取消',
              value: false
            }
          ]
        }
      ])
      if(!action) {
        console.log(chalk.whiteBright('已取消!'));
        return
      } else {
        await fs.remove(targetDir)
      }
    }
  }

  // 创建项目
  const creator = new Creator(projectName, targetDir)
  creator.create()
}
 

module.exports = create