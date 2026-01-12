import { createClient } from "@supabase/supabase-js";

let supabaseInstance = null;

// 서버 사이드 전용 클라이언트 (service_role 키 사용)
// 지연 초기화로 빌드 시 환경변수 없어도 에러 방지
export function getSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("[SUPABASE] Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseInstance;
}

// 호환성을 위한 getter (기존 import { supabase } 코드 지원)
export const supabase = {
  from: (table) => {
    const client = getSupabase();
    if (!client) {
      // 빌드 시 또는 환경변수 없을 때 더미 객체 반환
      return {
        insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        select: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      };
    }
    return client.from(table);
  },
};
