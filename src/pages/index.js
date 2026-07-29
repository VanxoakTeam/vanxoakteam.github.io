import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const sections = [
  {
    number: '01',
    title: '快速使用',
    description: '完成硬件连接、串口调试、文件传输与固件烧录。',
    path: '/docs/HD-RK3506-EVB/QuickStart/HardwareConnection',
  },
  {
    number: '02',
    title: '板载功能',
    description: '体验网络、Wi-Fi、蓝牙、显示、串口和扩展 IO。',
    path: '/docs/HD-RK3506-EVB/OnboardFeatures/NetworkUsage',
  },
  {
    number: '03',
    title: '应用开发',
    description: '从 HelloWorld 开始学习 Linux 应用与硬件接口编程。',
    path: '/docs/HD-RK3506-EVB/ApplicationDevelopment/BasicProgramming/HelloWorldCompilation',
  },
  {
    number: '04',
    title: '编译环境',
    description: '搭建开发主机、获取 SDK 并完成系统编译。',
    path: '/docs/HD-RK3506-EVB/QuickStart/DevelopmentHostSetup',
  },
  {
    number: '05',
    title: '系统开发',
    description: '了解 OTA、SD 卡启动、UVC 摄像头与远程登录。',
    path: '/docs/HD-RK3506-EVB/SystemDevelopment/OTAUpgradeGuide',
  },
];

export default function Home() {
  return (
    <Layout
      title="HD-RK3506-EVB 文档中心"
      description="HD-RK3506-EVB 开发板使用与开发文档">
      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.eyebrow}>RK3506 DEVELOPMENT BOARD</div>
            <h1 className={styles.heroTitle}>HD-RK3506-EVB 文档中心</h1>
            <p className={styles.heroDescription}>
              从首次上电到应用、驱动与系统开发，一站式查阅开发板资料。
            </p>
            <div className={styles.actions}>
              <Link
                className="button button--primary button--lg"
                to="/docs/HD-RK3506-EVB/ProductIntroduction">
                开始阅读
              </Link>
              <Link
                className={`button button--secondary button--lg ${styles.secondaryButton}`}
                to="/docs/HD-RK3506-EVB/QuickStart/HardwareConnection">
                快速上手
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.docsSection}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.sectionLabel}>DOCUMENTATION</span>
                <h2>开发文档</h2>
              </div>
              <p>按开发阶段选择你需要的内容</p>
            </div>
            <div className={styles.grid}>
              {sections.map((section) => (
                <Link
                  className={styles.card}
                  key={section.number}
                  to={section.path}>
                  <span className={styles.cardNumber}>{section.number}</span>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                  <span className={styles.cardLink}>查看文档 <span aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
