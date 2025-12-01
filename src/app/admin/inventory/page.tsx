'use client';

import { useEffect, useState } from "react";

type StockRow = {
  bean_name: string;
  stock_grams?: number;
  id?: string;
};

type MenuRow = {
  id: string;
  name: string;
};

type ApiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

export default function InventoryPage() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<ApiState>({ status: "idle" });
  const [newBean, setNewBean] = useState("");
  const [newGram, setNewGram] = useState(0);

  const fetchStocks = async () => {
    setLoading(true);
    setState({ status: "idle" });
    const res = await fetch("/api/inventory");
    if (!res.ok) {
      setState({ status: "error", message: `HTTP ${res.status}` });
      setLoading(false);
      return;
    }
    const json = await res.json();
    setRows(json.data ?? []);
    setLoading(false);
  };

  const fetchMenu = async () => {
    const res = await fetch("/api/admin/menu");
    if (!res.ok) return;
    const json = await res.json();
    setMenuItems(json.data ?? []);
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchStocks();
    fetchMenu();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const updateStock = async (beanName: string, deltaGram: number) => {
    setState({ status: "loading" });
    const res = await fetch("/api/inventory/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beanName, deltaGram }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setState({
        status: "error",
        message: json?.error || `HTTP ${res.status}`,
      });
      return;
    }
    setState({ status: "success", message: "在庫を更新しました" });
    fetchStocks();
  };

  const handleNew = async () => {
    if (!newBean || newGram === 0) return;
    await updateStock(newBean, newGram);
    setNewBean("");
    setNewGram(0);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
          Inventory
        </p>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">
          在庫一覧・更新
        </h1>
        <p className="text-sm text-gray-600">
          bean_stock の在庫を増減できます。SOLD OUT 表示の判定にも使われます。
        </p>
      </header>

      <section className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-[#1c1c1c]">在庫一覧</h2>
        {loading ? (
          <p className="mt-3 text-sm text-gray-600">読み込み中…</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="px-3 py-2">Bean</th>
                  <th className="px-3 py-2">Product ID</th>
                  <th className="px-3 py-2">在庫(g)</th>
                  <th className="px-3 py-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {getMergedRows(rows, menuItems).map((row) => (
                  <tr key={row.bean_name} className="border-t border-[#f0f0f0]">
                    <td className="px-3 py-2 font-semibold text-[#1c1c1c]">
                      {row.bean_name}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {row.product_id || "-"}
                    </td>
                    <td className="px-3 py-2">
                      {row.stock_grams ?? 0}g
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        {[100, 500, 1000].map((delta) => (
                          <button
                            key={`plus-${delta}`}
                            onClick={() => updateStock(row.bean_name, delta)}
                            className="rounded-full bg-[#a4de02] px-3 py-1 text-xs font-semibold text-[#0f1c0a] shadow-sm"
                          >
                            +{delta}g
                          </button>
                        ))}
                        {[100, 500, 1000].map((delta) => (
                          <button
                            key={`minus-${delta}`}
                            onClick={() => updateStock(row.bean_name, -delta)}
                            className="rounded-full border border-[#e0e0e0] px-3 py-1 text-xs font-semibold text-[#1f3b08]"
                          >
                            -{delta}g
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-[#1c1c1c]">新規追加 / 任意更新</h2>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <input
            type="text"
            placeholder="Bean name"
            value={newBean}
            onChange={(e) => setNewBean(e.target.value)}
            className="w-48 rounded-lg border border-[#e2e2e2] px-3 py-2"
          />
          <input
            type="number"
            placeholder="増減 (例: 500)"
            value={newGram}
            onChange={(e) => setNewGram(Number(e.target.value))}
            className="w-32 rounded-lg border border-[#e2e2e2] px-3 py-2"
          />
          <button
            onClick={handleNew}
            className="rounded-full bg-[#1f3b08] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-[1px] hover:shadow-md"
          >
            更新
          </button>
        </div>
      </section>

      {state.status === "error" && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          エラー: {state.message}
        </div>
      )}
      {state.status === "success" && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
          {state.message}
        </div>
      )}
    </main>
  );
}

const getMergedRows = (stocks: StockRow[], menus: MenuRow[]) => {
  const map = new Map<
    string,
    {
      bean_name: string;
      product_id?: string;
      stock_grams?: number;
    }
  >();
  stocks.forEach((s) => {
    map.set(s.bean_name, {
      bean_name: s.bean_name,
      stock_grams: s.stock_grams,
      product_id: undefined,
    });
  });
  menus.forEach((m) => {
    const existing = map.get(m.name);
    if (existing) {
      existing.product_id = m.id;
    } else {
      map.set(m.name, {
        bean_name: m.name,
        product_id: m.id,
        green_stock_gram: 0,
      });
    }
  });
  return Array.from(map.values()).sort((a, b) =>
    a.bean_name.localeCompare(b.bean_name)
  );
};
