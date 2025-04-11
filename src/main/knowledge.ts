import path from 'path';
import { app } from 'electron';
import log from 'electron-log';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { captureException } from './logging';
import { loadDocument } from './docloader';
import { randomId, smartChunk } from './util';

// 简单的文件系统存储替代向量数据库
const KNOWLEDGE_DIR = path.join(app.getPath('userData'), 'knowledge');

// 确保知识库目录存在
if (!fs.existsSync(KNOWLEDGE_DIR)) {
  fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
}

export default class Knowledge {
  private static async ensureCollectionDir(collectionId: string) {
    const collectionDir = path.join(KNOWLEDGE_DIR, collectionId);
    if (!fs.existsSync(collectionDir)) {
      await fsPromises.mkdir(collectionDir, { recursive: true });
    }
    return collectionDir;
  }

  public static async importFile({
    file,
    collectionId,
    onProgress,
    onSuccess,
  }: {
    file: {
      id: string;
      path: string;
      name: string;
      size: number;
      type: string;
    };
    collectionId: string;
    onProgress?: (filePath: string, total: number, done: number) => void;
    onSuccess?: (data: any) => void;
  }) {
    try {
      const textContent = await loadDocument(file.path, file.type);
      const chunks = smartChunk(textContent);

      const collectionDir = await this.ensureCollectionDir(collectionId);
      const fileDir = path.join(collectionDir, file.id);

      if (!fs.existsSync(fileDir)) {
        await fsPromises.mkdir(fileDir, { recursive: true });
      }

      // 保存文件信息
      await fsPromises.writeFile(
        path.join(fileDir, 'info.json'),
        JSON.stringify({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          path: file.path,
          numOfChunks: chunks.length,
        }),
        'utf-8',
      );

      // 保存每个文本块
      for (let i = 0; i < chunks.length; i += 1) {
        const chunkId = randomId();
        await fsPromises.writeFile(
          path.join(fileDir, `${chunkId}.txt`),
          chunks[i],
          'utf-8',
        );

        if (onProgress) {
          onProgress(file.path, chunks.length, i + 1);
        }
      }

      if (onSuccess) {
        onSuccess({
          collectionId,
          file,
          numOfChunks: chunks.length,
        });
      }
    } catch (err: any) {
      captureException(err);
      throw err;
    }
  }

  public static async getChunk(id: string) {
    try {
      // 遍历所有集合目录查找包含此ID的文件
      const collections = await fsPromises.readdir(KNOWLEDGE_DIR);

      for (const collectionId of collections) {
        const collectionDir = path.join(KNOWLEDGE_DIR, collectionId);
        const files = await fsPromises.readdir(collectionDir);

        for (const fileId of files) {
          const fileDir = path.join(collectionDir, fileId);
          const chunkPath = path.join(fileDir, `${id}.txt`);

          if (fs.existsSync(chunkPath)) {
            const content = await fsPromises.readFile(chunkPath, 'utf-8');
            const infoPath = path.join(fileDir, 'info.json');
            const info = JSON.parse(
              await fsPromises.readFile(infoPath, 'utf-8'),
            );

            return {
              id,
              collectionId,
              fileId,
              content,
            };
          }
        }
      }

      return null;
    } catch (err: any) {
      captureException(err);
      return null;
    }
  }

  public static async search(
    collectionIds: string[],
    query: string,
    options?: { limit?: number },
  ) {
    // 简单实现：返回所有集合中的文本块
    const results = [];
    const limit = options?.limit || 6;

    try {
      for (const collectionId of collectionIds) {
        const collectionDir = path.join(KNOWLEDGE_DIR, collectionId);

        if (fs.existsSync(collectionDir)) {
          const files = await fsPromises.readdir(collectionDir);

          for (const fileId of files) {
            const fileDir = path.join(collectionDir, fileId);
            const files = await fsPromises.readdir(fileDir);

            for (const file of files) {
              if (file.endsWith('.txt')) {
                const id = file.replace('.txt', '');
                const content = await fsPromises.readFile(
                  path.join(fileDir, file),
                  'utf-8',
                );

                // 简单文本匹配
                if (content.toLowerCase().includes(query.toLowerCase())) {
                  results.push({
                    id,
                    collectionId,
                    fileId,
                    content,
                  });

                  if (results.length >= limit) {
                    return results;
                  }
                }
              }
            }
          }
        }
      }

      return results;
    } catch (err: any) {
      captureException(err);
      return [];
    }
  }

  public static async remove({
    id,
    collectionId,
    fileId,
  }: {
    id?: string;
    collectionId?: string;
    fileId?: string;
  }) {
    try {
      if (id) {
        // 删除特定文本块
        const collections = await fsPromises.readdir(KNOWLEDGE_DIR);

        for (const collection of collections) {
          const collectionDir = path.join(KNOWLEDGE_DIR, collection);
          const files = await fsPromises.readdir(collectionDir);

          for (const file of files) {
            const fileDir = path.join(collectionDir, file);
            const chunkPath = path.join(fileDir, `${id}.txt`);

            if (fs.existsSync(chunkPath)) {
              await fsPromises.unlink(chunkPath);
              return true;
            }
          }
        }
      } else if (fileId) {
        // 删除特定文件的所有文本块
        const collections = await fsPromises.readdir(KNOWLEDGE_DIR);

        for (const collection of collections) {
          const fileDir = path.join(KNOWLEDGE_DIR, collection, fileId);

          if (fs.existsSync(fileDir)) {
            await fsPromises.rm(fileDir, { recursive: true });
            return true;
          }
        }
      } else if (collectionId) {
        // 删除整个集合
        const collectionDir = path.join(KNOWLEDGE_DIR, collectionId);

        if (fs.existsSync(collectionDir)) {
          await fsPromises.rm(collectionDir, { recursive: true });
          return true;
        }
      }

      return false;
    } catch (err: any) {
      captureException(err);
      return false;
    }
  }
}
