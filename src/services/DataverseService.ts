/**
 * DataverseService スタブ
 *
 * このファイルは `npx power-apps add-data-source` 実行前のビルドを通すための
 * プレースホルダーです。データソース追加後は自動生成されたサービスに置き換わります。
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const DataverseService = {
  async GetItems(table: string, query?: string): Promise<any[]> {
    console.warn(
      `[DataverseService stub] GetItems(${table}${
        query ? `, ${query}` : ""
      }) called — run 'npx power-apps add-data-source' to connect.`,
    );
    return [];
  },
  async GetItem(table: string, id: string, query?: string): Promise<any> {
    console.warn(
      `[DataverseService stub] GetItem(${table}, ${id}${
        query ? `, ${query}` : ""
      }) called — run 'npx power-apps add-data-source' to connect.`,
    );
    return null;
  },
  async PostItem(table: string, body: Record<string, unknown>): Promise<any> {
    console.warn(
      `[DataverseService stub] PostItem(${table}, keys: ${Object.keys(body).join(", ")}) called — run 'npx power-apps add-data-source' to connect.`,
    );
    return {};
  },
  async PatchItem(
    table: string,
    id: string,
    body: Record<string, unknown>,
  ): Promise<void> {
    console.warn(
      `[DataverseService stub] PatchItem(${table}, ${id}, keys: ${Object.keys(body).join(", ")}) called — run 'npx power-apps add-data-source' to connect.`,
    );
  },
  async DeleteItem(table: string, id: string): Promise<void> {
    console.warn(
      `[DataverseService stub] DeleteItem(${table}, ${id}) called — run 'npx power-apps add-data-source' to connect.`,
    );
  },
};
