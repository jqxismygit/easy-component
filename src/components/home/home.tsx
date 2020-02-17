import React from 'react';
import { Button } from 'antd';
import { Link } from 'gatsby';
import styles from './home.module.less';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <div className={styles.homeWrapper}>
        <div key="line" className={styles.titleLineWrapper}>
          <div className={styles.titleLine} style={{ transform: 'translateX(-64px)' }} />
        </div>
        <h1 key="h1">easy component</h1>
        <p>基于antd的组件库</p>
        <div className={styles.buttonWrapper}>
          <Link to="/docs/getting-started">
            <Button type="primary">文档</Button>
          </Link>
          <Link to="/components/send-button">
            <Button style={{ margin: '0 16px' }} type="primary" ghost>
              组件
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
