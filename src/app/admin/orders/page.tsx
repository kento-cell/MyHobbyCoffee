'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type OrderItem = {
  product_name: string;
  roast: string;
  grams: number;
  unit_price: number;
  subtotal: number;
};

type OrderRow = {
  id: string;
  email: string;
  total_amount: number;
  status: string;
  roasted_at?: string | null;
  created_at?: string | null;
  order_items?: OrderItem[];
};

type ApiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

const statusLabel = (s: string) => {
  switch (s) {
    case "paid":
      return "支払い済み";
    case "shipped":
      return "発送済み";
    case "delivered":
      return "納品済み";
    default:
      return s;
  }
};

export default function AdminOrdersPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [state, setState] = useState<ApiState>({ status: "idle" });

  const getAuthHeaders = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("認証情報がありません");
    return { Authorization: `Bearer ${token}` };
  }, [supabase]);

  const fetchOrders = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/orders", { headers });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      setOrders(json.data || []);
      setState({ status: "idle" });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "注文の取得に失敗しました",
      });
    }
  }, [getAuthHeaders]);

  const updateStatus = async (id: string, status: string) => {
    setState({ status: "loading" });
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      setState({ status: "success", message: "ステータスを更新しました" });
      fetchOrders();
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "ステータス更新に失敗しました",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 15000);
    return () => clearInterval(timer);
  }, [fetchOrders]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Orders</p>
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">注文一覧</h1>
        <p className="text-sm text-gray-600">
          15秒ごとに最新の注文を自動取得します。発送が済んだら「納品済みにする」でステータスを更新してください。
        </p>
      </header>

      {state.status === "error" && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}
      {state.status === "success" && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.message}
        </div>
      )}

      <div className="rounded-2xl border border-[#e8e8e8] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-[#1c1c1c]">注文</h2>
          <button
            onClick={fetchOrders}
            className="rounded-full border border-[#dcdcdc] px-4 py-2 text-xs font-semibold text-[#1f3b08] transition hover:-translate-y-[1px]"
          >
            手動更新
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-3 py-2">注文ID</th>
                <th className="px-3 py-2">メール</th>
                <th className="px-3 py-2">金額</th>
                <th className="px-3 py-2">ステータス</th>
                <th className="px-3 py-2">商品</th>
                <th className="px-3 py-2">日時</th>
                <th className="px-3 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#f0f0f0] align-top">
                  <td className="px-3 py-2 font-mono text-xs text-gray-700">{order.id}</td>
                  <td className="px-3 py-2">{order.email}</td>
                  <td className="px-3 py-2 font-semibold text-[#1f3b08]">
                    ¥{order.total_amount?.toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-[#f2f7e8] px-3 py-1 text-xs font-semibold text-[#1f3b08]">
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-3 py-2 space-y-1">
                    {(order.order_items || []).map((item, idx) => (
                      <div key={`${order.id}-item-${idx}`} className="text-gray-700">
                        <span className="font-semibold">{item.product_name}</span>{" "}
                        <span className="text-xs text-gray-500">({item.roast})</span>
                        <div className="text-xs text-gray-600">
                          {item.grams}g / ¥{item.unit_price?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      className="rounded-full bg-[#a4de02] px-3 py-2 text-xs font-semibold text-[#0f1c0a] shadow-sm transition hover:-translate-y-[1px]"
                    >
                      納品済みにする
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-600">
                    注文はまだありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
