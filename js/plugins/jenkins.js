/**
 * @file jenkins plugin script
 * @description jenkins plugin
 * @author tomasy
 * @email solopea@gmail.com
 */

define(function (require, exports, module) {
    var util = require('../common/util')

    var name = 'jenkins'
    var key = 'jk'
    var icon = chrome.extension.getURL('img/jenkins.png')
    var title = chrome.i18n.getMessage(name + '_title')
    var subtitle = chrome.i18n.getMessage(name + '_subtitle')
    var SERVER_URL = window.localStorage['jenkins_url'] || ''
    var jobs = []

    function getJobs() {
        if (jobs.length) {
            return new Promise((resolve, reject) => {
                resolve(jobs)
            })
        }

        return new Promise((resolve, reject) => {
            fetch(SERVER_URL + '/api/json?tree=jobs[name,url,color,healthReport[description,score,iconUrl]]')
                .then((resp) => resp.json())
                .then((results) => {
                    jobs = results.jobs
                    resolve(jobs)
                })
                .catch(() => {
                    window.localStorage.removeItem['jenkins_url']
                    SERVER_URL = ''
                    alert('jenkins接口异常, 请重新填写server url...')
                })
        })
    }

    function setUrl() {
        var iptval = window.prompt('jenkins url:')
        if (!iptval) {
            return
        }

        if (iptval.endsWith('/')) {
            iptval = iptval.slice(0, -1)
        }

        if (iptval.indexOf('http://') === -1) {
            iptval = 'http://' + iptval
        }

        SERVER_URL = iptval
        window.localStorage['jenkins_url'] = SERVER_URL
    }

    function onInput(key) {
        if (!SERVER_URL) {
            setUrl()
        }

        if (!SERVER_URL) {
            return
        }

        getJobs().then((results) => {
            var jobs = results.filter((job) => {
                return key ? job.name.replace(/-/, '').indexOf(key.replace(/-/, '')) !== -1 : true
            }).slice(0, 50)

            this.showItemList(jobs.map((item) => {
                return {
                    key: key,
                    id: item.url,
                    icon: icon,
                    title: item.name,
                    desc: item.healthReport.length ? item.healthReport[0].description : 'no build history',
                    isWarn: item.healthReport.length && item.healthReport[0].score !== 100
                }
            }))
        })
    }

    function onEnter(id) {
        if (id) {
            window.open(id)
        }
    }

    module.exports = {
        key: key,
        icon: icon,
        title: title,
        subtitle: subtitle,
        onInput: onInput,
        onEnter: onEnter
    };
});