import React from 'react';
import {Editor} from 'amis-editor';
import {inject, observer} from 'mobx-react';
import {IMainStore} from '../store';
import {RouteComponentProps} from 'react-router-dom';
import {Layout, Switch, classnames as cx, toast} from 'amis';
import '../renderer/MyRenderer';
import '../editor/MyRenderer';
import axios from 'axios';

let currentIndex = -1;

let host = `${window.location.protocol}//${window.location.host}`;
let iframeUrl = '/editor.html';

// 如果在 gh-pages 里面
if (/^\/amis-editor-demo/.test(window.location.pathname)) {
    host += '/amis-editor';
    iframeUrl = '/amis-editor-demo' + iframeUrl;
}

const schemaUrl = `${host}/schema.json`;

// @ts-ignore
__uri('amis/schema.json');

export default inject('store')(
    observer(function({store, location, history, match}: {store: IMainStore} & RouteComponentProps<{id: string}>) {
        const index: number = parseInt(match.params.id, 10);

        if (index !== currentIndex) {
            currentIndex = index;
            store.updateSchema(store.pages[index].schema);
        }

        function save() {
            store.updatePageSchemaAt(index);
            toast.success('保存成功!', '提示');
        }

        function exit() {
            history.push(`/${store.pages[index].path}`);
        }

        //my sync function for page config json
        function getPageConfig() {
            console.log(
                'go to print the cur page json via JSON.stringify~ and then save to cloud func');
            var pageJson = store.pages[index].schema;
            const pageJsonStr = JSON.stringify(pageJson);
            console.log('body part:' + JSON.stringify(pageJson['body'][1]['body']));
            var params = new URLSearchParams();
            params.append('appid', 'demo');
            params.append('pageid', index.toString());
            params.append('pageConfig', pageJsonStr);
            axios.post('https://service-3b93s0ed-1252510749.sh.apigw.tencentcs.com/release/creatorWechat?func=savePageJsonConfig',
                params).then(function(value) {
                console.log('save ok');
                console.log(value);
            }).catch(function(reason) {
                console.log(reason);
            });

        }

        function renderHeader() {
            return (
                <div className="editor-header clearfix box-shadow bg-dark">
                    <div className="editor-preview">
                        预览{' '}
                        <Switch
                            value={store.preview}
                            onChange={(value: boolean) => store.setPreview(value)}
                            className="m-l-xs"
                            inline
                        />
                    </div>

                    <div className="editor-preview">
                        移动端{' '}
                        <Switch
                            value={store.isMobile}
                            onChange={(value: boolean) => store.setIsMobile(value)}
                            className="m-l-xs"
                            inline
                        />
                    </div>

                    <div className="editor-header-btns">
                        <div className={cx('btn-item')} onClick={save}>
                            保存
                        </div>

                        <div className="btn-item" onClick={exit}>
                            退出
                        </div>

                        <div className="btn-item" onClick={getPageConfig}>
                            同步页面代码
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Layout header={renderHeader()} headerFixed={false}>
                <Editor
                    theme={'cxd'}
                    preview={store.preview}
                    value={store.schema}
                    onChange={(value: any) => store.updateSchema(value)}
                    className="is-fixed"
                    $schemaUrl={schemaUrl}
                    iframeUrl={iframeUrl}
                    isMobile={store.isMobile}
                />
            </Layout>
        );
    })
);
