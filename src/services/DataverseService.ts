/**
 * DataverseService スタブ
 *
 * このファイルは `npx power-apps add-data-source` 実行前のビルドを通すための
 * プレースホルダーです。データソース追加後は自動生成されたサービスに置き換わります。
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const DataverseService = {
  async GetItems(_table: string, _query?: string): Promise<any[]> {
    console.warn(
      "[DataverseService stub] GetItems called — run 'npx power-apps add-data-source' to connect.",
    );
    return [];
  },
  async GetItem(_table: string, _id: string, _query?: string): Promise<any> {
    console.warn(
      "[DataverseService stub] GetItem called — run 'npx power-apps add-data-source' to connect.",
    );
    return null;
  },
  async PostItem(_table: string, _body: Record<string, unknown>): Promise<any> {
    console.warn(
      "[DataverseService stub] PostItem called — run 'npx power-apps add-data-source' to connect.",
    );
    return {};
  },
  async PatchItem(
    _table: string,
    _id: string,
    _body: Record<string, unknown>,
  ): Promise<void> {
    console.warn(
      "[DataverseService stub] PatchItem called — run 'npx power-apps add-data-source' to connect.",
    );
  },
  async DeleteItem(_table: string, _id: string): Promise<void> {
    console.warn(
      "[DataverseService stub] DeleteItem called — run 'npx power-apps add-data-source' to connect.",
    );
  },
};
