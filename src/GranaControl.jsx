import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, Building2, Users, Store, Calculator, Briefcase, Landmark,
  Sparkles, ShieldCheck, BarChart3, Rocket, Bell, Search, ChevronRight, ArrowRight,
  ArrowUpRight, Check, CheckCircle2, Lock, FileText, Download, TrendingUp, TrendingDown,
  CreditCard, Wallet, Menu, X, Home, User, Clock, AlertTriangle, Plus, Zap, Globe,
  Database, Cpu, ScrollText, Percent, Smartphone, ChevronLeft, BadgeCheck, Activity,
  GraduationCap, Play, Filter, MessageSquare, Send, DollarSign, Layers, KeyRound, Eye, ArrowLeftRight, LogOut, Building
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  Cell, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

/* ------------------------------------------------------------------ helpers */
const brl = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const brl2 = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
const cls = (...a) => a.filter(Boolean).join(" ");
const pmt = (pv, iMonthly, n) => (pv * iMonthly) / (1 - Math.pow(1 + iMonthly, -n));

/* ------------------------------------------------------------------ data */
const BANKS = [
  { id: "bmg", nome: "Banco Crédito+", mono: "C+", color: "bg-blue-600", taxa: 1.59, prazo: 96, seguro: true, tempo: "2 min" },
  { id: "pan", nome: "PanCred", mono: "P", color: "bg-indigo-600", taxa: 1.72, prazo: 84, seguro: true, tempo: "5 min" },
  { id: "c6", nome: "Banco Onda", mono: "On", color: "bg-slate-800", taxa: 1.84, prazo: 72, seguro: false, tempo: "1 min" },
  { id: "day", nome: "Daycred", mono: "D", color: "bg-emerald-600", taxa: 1.66, prazo: 96, seguro: true, tempo: "8 min" },
  { id: "saf", nome: "Safira Bank", mono: "S", color: "bg-violet-600", taxa: 1.91, prazo: 60, seguro: true, tempo: "12 min" },
  { id: "itau", nome: "Banco União", mono: "U", color: "bg-amber-500", taxa: 1.78, prazo: 84, seguro: false, tempo: "3 min" },
];

const EMPRESAS = [
  { id: 1, nome: "TechNova Sistemas", setor: "Tecnologia", uf: "SP", colab: 1240, folha: 11800000, convenio: "Ativo", bancos: 6, volume: 8400000, receita: 142000, status: "Ativo", elegiveis: 980, contratos: 312, rh: "Marina Castro" },
  { id: 2, nome: "Construtora Horizonte", setor: "Construção", uf: "MG", colab: 860, folha: 6200000, convenio: "Ativo", bancos: 5, volume: 5100000, receita: 96000, status: "Ativo", elegiveis: 640, contratos: 188, rh: "Paulo Andrade" },
  { id: 3, nome: "Rede Vida Saúde", setor: "Saúde", uf: "RJ", colab: 2100, folha: 18900000, convenio: "Ativo", bancos: 6, volume: 12600000, receita: 221000, status: "Ativo", elegiveis: 1620, contratos: 540, rh: "Juliana Reis" },
  { id: 4, nome: "Logística Andrade", setor: "Transporte", uf: "PR", colab: 540, folha: 3400000, convenio: "Em análise", bancos: 3, volume: 1900000, receita: 31000, status: "Onboarding", elegiveis: 410, contratos: 64, rh: "Ricardo Lopes" },
  { id: 5, nome: "Supermercados BomPreço", setor: "Varejo", uf: "BA", colab: 3200, folha: 22400000, convenio: "Ativo", bancos: 6, volume: 16800000, receita: 298000, status: "Ativo", elegiveis: 2480, contratos: 712, rh: "Camila Souza" },
  { id: 6, nome: "Metalúrgica Sul", setor: "Indústria", uf: "RS", colab: 720, folha: 6800000, convenio: "Ativo", bancos: 4, volume: 4300000, receita: 78000, status: "Ativo", elegiveis: 560, contratos: 151, rh: "André Becker" },
  { id: 7, nome: "Colégio Saber+", setor: "Educação", uf: "SP", colab: 410, folha: 3100000, convenio: "Pausado", bancos: 4, volume: 1200000, receita: 18000, status: "Pausado", elegiveis: 320, contratos: 41, rh: "Fernanda Lima" },
  { id: 8, nome: "AgroVale Cooperativa", setor: "Agro", uf: "GO", colab: 980, folha: 7900000, convenio: "Ativo", bancos: 5, volume: 6700000, receita: 119000, status: "Ativo", elegiveis: 770, contratos: 224, rh: "Tiago Moraes" },
];

const COLAB = [
  { id: 1, nome: "Ana Beatriz Lima", empresa: "TechNova Sistemas", cargo: "Analista de Dados", salario: 7200, tempo: 4.2, margem: 2520, limite: 38000, banco: "Crédito+", score: 812, status: "Elegível" },
  { id: 2, nome: "Carlos Eduardo Pinto", empresa: "Rede Vida Saúde", cargo: "Enfermeiro", salario: 5400, tempo: 6.0, margem: 1890, limite: 29000, banco: "—", score: 744, status: "Elegível" },
  { id: 3, nome: "Daniela Rocha", empresa: "Supermercados BomPreço", cargo: "Gerente de Loja", salario: 8900, tempo: 8.5, margem: 3115, limite: 52000, banco: "Daycred", score: 868, status: "Contrato ativo" },
  { id: 4, nome: "Eduardo Nunes", empresa: "Metalúrgica Sul", cargo: "Operador", salario: 3800, tempo: 2.1, margem: 1330, limite: 18000, banco: "—", score: 690, status: "Em análise" },
  { id: 5, nome: "Fernanda Alves", empresa: "Construtora Horizonte", cargo: "Engenheira Civil", salario: 11200, tempo: 5.7, margem: 3920, limite: 71000, banco: "PanCred", score: 891, status: "Contrato ativo" },
  { id: 6, nome: "Gustavo Henrique", empresa: "AgroVale Cooperativa", cargo: "Técnico Agrícola", salario: 4600, tempo: 3.3, margem: 1610, limite: 24000, banco: "—", score: 718, status: "Elegível" },
  { id: 7, nome: "Helena Martins", empresa: "TechNova Sistemas", cargo: "Product Manager", salario: 14500, tempo: 3.0, margem: 5075, limite: 96000, banco: "Banco União", score: 905, status: "Contrato ativo" },
  { id: 8, nome: "Igor Tavares", empresa: "Logística Andrade", cargo: "Motorista", salario: 3200, tempo: 1.4, margem: 1120, limite: 12000, banco: "—", score: 642, status: "Em análise" },
];

/* --- multi-tenant por CNPJ --- */
const CNPJS = { 1: "12.345.678/0001-90", 2: "23.456.789/0001-01", 3: "34.567.890/0001-12", 4: "45.678.901/0001-23", 5: "56.789.012/0001-34", 6: "67.890.123/0001-45", 7: "78.901.234/0001-56", 8: "89.012.345/0001-67" };
const PORTAL = { 1: "Ativo", 2: "Ativo", 3: "Ativo", 4: "Convidado", 5: "Ativo", 6: "Ativo", 7: "Pausado", 8: "Ativo" };
EMPRESAS.forEach((e) => { e.cnpj = CNPJS[e.id]; e.portal = PORTAL[e.id]; });

const FIRST = ["Ana", "Bruno", "Carla", "Diego", "Elisa", "Felipe", "Gabriela", "Hugo", "Isabela", "João", "Karina", "Lucas", "Mariana", "Nelson", "Olívia", "Pedro", "Renata", "Sérgio", "Tatiana", "Vitor", "Beatriz", "Rafael", "Sophia", "Thiago"];
const LAST = ["Silva", "Souza", "Oliveira", "Santos", "Pereira", "Costa", "Almeida", "Lima", "Ferreira", "Rodrigues", "Gomes", "Martins", "Araújo", "Barbosa", "Ribeiro", "Carvalho"];
const CARGOS = {
  Tecnologia: ["Desenvolvedor", "Analista de Dados", "Product Manager", "Designer", "QA", "Tech Lead"],
  Construção: ["Engenheiro Civil", "Mestre de Obras", "Pedreiro", "Técnico de Segurança", "Almoxarife"],
  Saúde: ["Enfermeiro", "Técnico de Enfermagem", "Médico", "Recepcionista", "Farmacêutico"],
  Transporte: ["Motorista", "Conferente", "Operador de Logística", "Supervisor de Frota"],
  Varejo: ["Operador de Caixa", "Gerente de Loja", "Repositor", "Vendedor", "Estoquista"],
  Indústria: ["Operador", "Soldador", "Supervisor de Produção", "Mecânico", "Inspetor"],
  Educação: ["Professor", "Coordenador", "Auxiliar Administrativo", "Bibliotecário"],
  Agro: ["Técnico Agrícola", "Operador de Máquinas", "Agrônomo", "Auxiliar de Campo"],
};
const STATUSES = ["Contrato ativo", "Elegível", "Elegível", "Em análise", "Elegível"];
function genColabs(emp) {
  let s = emp.id * 7919 + 13;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const n = Math.max(10, Math.min(22, Math.round(emp.colab / 90)));
  const cargos = CARGOS[emp.setor] || CARGOS.Tecnologia;
  return Array.from({ length: n }, (_, i) => {
    const sal = Math.round((2500 + rnd() * 13500) / 100) * 100;
    const margem = Math.round(sal * (0.30 + rnd() * 0.05));
    const status = STATUSES[Math.floor(rnd() * STATUSES.length)];
    return {
      id: emp.id * 100 + i,
      nome: `${FIRST[Math.floor(rnd() * FIRST.length)]} ${LAST[Math.floor(rnd() * LAST.length)]}`,
      cargo: cargos[Math.floor(rnd() * cargos.length)],
      salario: sal, margem, limite: Math.round(margem * (18 + rnd() * 8)),
      tempo: +(0.5 + rnd() * 9).toFixed(1),
      score: 620 + Math.floor(rnd() * 290),
      banco: status === "Contrato ativo" ? BANKS[Math.floor(rnd() * BANKS.length)].nome : "—",
      status,
    };
  });
}
const COLAB_CACHE = {};
const colabsOf = (emp) => (COLAB_CACHE[emp.id] || (COLAB_CACHE[emp.id] = genColabs(emp)));

const RECEITA_MES = [
  { m: "Jan", v: 312 }, { m: "Fev", v: 348 }, { m: "Mar", v: 401 }, { m: "Abr", v: 467 },
  { m: "Mai", v: 540 }, { m: "Jun", v: 612 }, { m: "Jul", v: 690 }, { m: "Ago", v: 778 },
  { m: "Set", v: 854 }, { m: "Out", v: 940 }, { m: "Nov", v: 1020 }, { m: "Dez", v: 1147 },
];
const RECEITA_BANCO = BANKS.map((b, i) => ({ nome: b.mono, v: [298, 221, 96, 178, 64, 142][i] }));
const APROV = [
  { name: "Aprovados", v: 68, color: "#059669" },
  { name: "Em análise", v: 21, color: "#2563EB" },
  { name: "Reprovados", v: 11, color: "#E11D48" },
];
const UF_DIST = [
  { uf: "SP", v: 4200 }, { uf: "RJ", v: 2100 }, { uf: "BA", v: 3200 },
  { uf: "MG", v: 860 }, { uf: "RS", v: 720 }, { uf: "PR", v: 540 }, { uf: "GO", v: 980 },
];

/* ------------------------------------------------------------------ UI atoms */
function Card({ className, children, style }) {
  return <div style={style} className={cls("rounded-2xl border border-slate-200 bg-white", className)}>{children}</div>;
}
function Badge({ tone = "slate", children }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return <span className={cls("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", map[tone])}>{children}</span>;
}
function statusTone(s) {
  if (["Ativo", "Contrato ativo", "Elegível"].includes(s)) return "green";
  if (["Onboarding", "Em análise"].includes(s)) return "blue";
  if (s === "Pausado") return "amber";
  return "slate";
}
function KPI({ icon: Icon, label, value, delta, tone = "blue" }) {
  const pos = delta && delta > 0;
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className={cls("grid h-9 w-9 place-items-center rounded-xl",
          tone === "blue" ? "bg-blue-50 text-blue-600" : tone === "green" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600")}>
          <Icon size={18} />
        </span>
        {delta != null && (
          <span className={cls("inline-flex items-center gap-0.5 text-xs font-semibold", pos ? "text-emerald-600" : "text-rose-600")}>
            {pos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </Card>
  );
}
function Gauge({ value, max, label, sub }) {
  const pct = Math.min(value / max, 1);
  const r = 52, c = Math.PI * r; // half circle
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 80" className="w-44">
        <path d="M 8 76 A 62 62 0 0 1 132 76" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
        <path d="M 8 76 A 62 62 0 0 1 132 76" fill="none" stroke="#2563EB" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`} />
      </svg>
      <div className="-mt-6 text-center">
        <div className="text-xl font-semibold tracking-tight text-slate-900">{label}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
    </div>
  );
}
function tt() {
  return { contentStyle: { borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,.06)" } };
}

/* ================================================================== LANDING */
function Landing({ go }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* nav */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
            <a className="hover:text-slate-900">Produto</a>
            <a className="hover:text-slate-900">Empresas</a>
            <a className="hover:text-slate-900">Bancos</a>
            <a className="hover:text-slate-900">Segurança</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => go("mobile")} className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:block">App mobile</button>
            <button onClick={() => go("app")} className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">Entrar na plataforma</button>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" style={{ height: 480, width: 860 }} />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <Badge tone="blue"><Zap size={12} /> Consignado privado, sem fricção</Badge>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
              O futuro do Crédito Consignado Privado começa aqui.
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate-600">
              A GranaControl conecta empresas, colaboradores e bancos em uma única plataforma inteligente — automatizando o RH e dando ao colaborador a melhor taxa do mercado.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => go("app")} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                Solicitar demonstração <ArrowRight size={16} />
              </button>
              <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Falar com especialista
              </button>
            </div>
            <div className="mt-9 flex items-center gap-5 text-xs text-slate-400">
              <span>Bancos parceiros</span>
              <div className="flex -space-x-1.5">
                {BANKS.map((b) => (
                  <span key={b.id} className={cls("grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white ring-2 ring-white", b.color)}>{b.mono}</span>
                ))}
              </div>
            </div>
          </div>

          {/* product mock */}
          <div className="relative">
            <Card className="overflow-hidden shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="ml-2 text-xs text-slate-400">app.granacontrol.com</span>
              </div>
              <div className="space-y-3 p-4">
                <div className="grid grid-cols-3 gap-3">
                  {[["Volume", "R$ 1,14 bi"], ["Contratos", "2.232"], ["Aprovação", "68%"]].map(([l, v]) => (
                    <div key={l} className="rounded-xl bg-slate-50 p-3">
                      <div className="text-base font-semibold tracking-tight">{v}</div>
                      <div className="text-xs text-slate-500">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <div className="mb-1 text-xs font-medium text-slate-500">Receita recorrente (MRR)</div>
                  <ResponsiveContainer width="100%" height={110}>
                    <AreaChart data={RECEITA_MES}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={2} fill="url(#g1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* como funciona */}
      <section className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Como funciona</h2>
          <p className="mt-2 text-slate-600">Da integração da folha ao pagamento, em um fluxo único e auditável.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Integração da folha", "Conecte o sistema de RH e importe a base elegível."],
              ["02", "Marketplace de bancos", "Bancos e fintechs disputam a melhor proposta."],
              ["03", "Simulação & aprovação", "Colaborador compara taxas e contrata em minutos."],
              ["04", "Assinatura & gestão", "Assinatura digital, averbação e gestão automática."],
            ].map(([n, t, d]) => (
              <Card key={n} className="p-5">
                <span className="text-sm font-semibold text-blue-600">{n}</span>
                <h3 className="mt-2 font-semibold tracking-tight">{t}</h3>
                <p className="mt-1 text-sm text-slate-500">{d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* benefícios */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <Building2 className="text-blue-600" />
            <h3 className="mt-3 text-lg font-semibold tracking-tight">Para empresas</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {["Menos trabalho operacional no RH", "Controle automático da margem consignável", "Dashboard em tempo real e governança", "Compliance e LGPD por padrão", "Integração com a folha e relatórios gerenciais"].map((x) => (
                <li key={x} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />{x}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <Users className="text-blue-600" />
            <h3 className="mt-3 text-lg font-semibold tracking-tight">Para colaboradores</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              {["Crédito com taxas competitivas", "Comparação transparente entre bancos", "Processo 100% digital e assinatura eletrônica", "Acompanhamento das parcelas em tempo real", "Educação financeira integrada"].map((x) => (
                <li key={x} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />{x}</li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* segurança */}
      <section className="border-t border-slate-100 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Badge tone="blue"><ShieldCheck size={12} /> Segurança</Badge>
          <h2 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight">Confiança de banco, em infraestrutura de fintech.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [Lock, "Criptografia", "Dados em trânsito e em repouso com AES-256 / TLS 1.3."],
              [ScrollText, "LGPD", "Consentimento, anonimização e direito ao esquecimento."],
              [Activity, "Auditoria & logs", "Trilha completa e imutável de cada operação."],
              [Users, "Controle de acesso", "RBAC granular por papel e empresa."],
              [Globe, "Nuvem", "Infra escalável com alta disponibilidade."],
              [Bell, "Monitoramento", "Detecção de anomalias e alertas em tempo real."],
            ].map(([Ic, t, d]) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Ic size={20} className="text-blue-300" />
                <h3 className="mt-3 font-semibold tracking-tight">{t}</h3>
                <p className="mt-1 text-sm text-slate-300">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight">Pronto para transformar o consignado da sua empresa?</h2>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => go("app")} className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">Entrar na plataforma</button>
          <button onClick={() => go("mobile")} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Ver app do colaborador</button>
        </div>
        <footer className="mt-16 border-t border-slate-100 pt-8 text-sm text-slate-400">
          <Logo /> <span className="ml-2">© 2026 GranaControl · A plataforma do Crédito Consignado Privado</span>
        </footer>
      </section>
    </div>
  );
}
function Logo({ light }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white">
        <Wallet size={16} />
      </span>
      <span className={cls("text-base font-semibold tracking-tight", light ? "text-white" : "text-slate-900")}>GranaControl</span>
    </div>
  );
}

/* ================================================================== APP SHELL */
const NAV = [
  ["overview", "Visão geral", LayoutDashboard],
  ["empresas", "Empresas", Building2],
  ["acessos", "Acessos por CNPJ", KeyRound],
  ["colab", "Colaboradores", Users],
  ["marketplace", "Marketplace", Store],
  ["simulador", "Simulador", Calculator],
  ["rh", "Painel RH", Briefcase],
  ["banco", "Banco parceiro", Landmark],
  ["ia", "Inteligência (IA)", Sparkles],
  ["compliance", "Compliance", ShieldCheck],
  ["relatorios", "Relatórios", BarChart3],
  ["negocio", "Negócio & MVP", Rocket],
];
const EMPRESA_NAV = [
  ["bi", "Visão BI", BarChart3],
  ["ecolab", "Meus colaboradores", Users],
  ["econsult", "Consultoria", Sparkles],
  ["erel", "Relatórios", FileText],
];

function App({ go }) {
  const [tenant, setTenant] = useState(null); // null = operadora (Granatech) · empresa = portal por CNPJ
  const [page, setPage] = useState("overview");
  const [open, setOpen] = useState(false);
  const [switcher, setSwitcher] = useState(false);
  const enterEmpresa = (e) => { setTenant(e); setPage("bi"); setSwitcher(false); setOpen(false); };
  const exitEmpresa = () => { setTenant(null); setPage("overview"); setSwitcher(false); };
  const nav = tenant ? EMPRESA_NAV : NAV;
  const cur = nav.find((n) => n[0] === page) || nav[0];
  const portalEmpresas = EMPRESAS.filter((e) => e.portal !== "Pausado");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* sidebar */}
      <aside className={cls("fixed inset-y-0 left-0 z-40 w-60 border-r border-slate-200 bg-white transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-4 py-4"><Logo /><button className="md:hidden" onClick={() => setOpen(false)}><X size={18} /></button></div>
        {tenant && (
          <div className="mx-3 mb-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-700"><Building size={12} /> Portal da empresa</div>
            <div className="mt-0.5 truncate text-sm font-semibold text-slate-800">{tenant.nome}</div>
            <div className="text-xs text-slate-500 tabular-nums">CNPJ {tenant.cnpj}</div>
          </div>
        )}
        <nav className="px-2.5">
          {nav.map(([id, label, Ic]) => (
            <button key={id} onClick={() => { setPage(id); setOpen(false); }}
              className={cls("mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                page === id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50")}>
              <Ic size={17} className={page === id ? "text-blue-600" : "text-slate-400"} />{label}
            </button>
          ))}
        </nav>
        {tenant ? (
          <button onClick={exitEmpresa} className="absolute bottom-4 left-2.5 right-2.5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">
            <ArrowLeftRight size={16} /> Voltar à Operadora
          </button>
        ) : (
          <button onClick={() => go("landing")} className="absolute bottom-4 left-2.5 right-2.5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">
            <ChevronLeft size={16} /> Sair para o site
          </button>
        )}
      </aside>

      {/* main */}
      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur md:px-7">
          <button className="md:hidden" onClick={() => setOpen(true)}><Menu size={20} /></button>
          {/* seletor de visão (tenant) */}
          <div className="relative">
            <button onClick={() => setSwitcher((v) => !v)} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-50">
              {tenant ? <Building size={15} className="text-blue-600" /> : <Eye size={15} className="text-blue-600" />}
              <span style={{ maxWidth: 160 }} className="truncate">{tenant ? tenant.nome : "Granatech · Operadora"}</span>
              <ChevronRight size={14} className="rotate-90 text-slate-400" />
            </button>
            {switcher && (
              <div className="absolute left-0 top-11 z-40 w-72 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                <button onClick={exitEmpresa} className={cls("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50", !tenant && "bg-blue-50 text-blue-700")}>
                  <Eye size={15} /> <div className="text-left"><div className="font-medium">Granatech · Operadora</div><div className="text-xs text-slate-400">Enxerga toda a carteira</div></div>
                </button>
                <div className="my-1 border-t border-slate-100" />
                <div className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Portais por CNPJ</div>
                <div className="max-h-64 overflow-y-auto">
                  {portalEmpresas.map((e) => (
                    <button key={e.id} onClick={() => enterEmpresa(e)} className={cls("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-50", tenant && tenant.id === e.id && "bg-blue-50 text-blue-700")}>
                      <Building size={15} className="shrink-0 text-slate-400" />
                      <div className="text-left"><div className="font-medium">{e.nome}</div><div className="text-xs text-slate-400 tabular-nums">{e.cnpj}</div></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100">
              <Bell size={17} className="text-slate-500" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-xs font-semibold text-white">{tenant ? tenant.rh.split(" ").map((w) => w[0]).slice(0, 2).join("") : "TT"}</span>
              <div className="hidden text-left sm:block"><div className="text-sm font-medium leading-none">{tenant ? tenant.rh : "Tiago Tuma"}</div><div className="text-xs text-slate-400">{tenant ? "RH · " + tenant.nome.split(" ")[0] : "Admin · Granatech"}</div></div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 md:px-7">
          <div className="mb-5 flex items-center gap-2 text-xs text-slate-400">
            <span>{tenant ? "Portal da empresa" : "Operadora"}</span><ChevronRight size={13} /><span className="font-medium text-slate-600">{cur[1]}</span>
          </div>
          {!tenant && page === "overview" && <Overview />}
          {!tenant && page === "empresas" && <Empresas />}
          {!tenant && page === "acessos" && <AcessosCNPJ onEnter={enterEmpresa} />}
          {!tenant && page === "colab" && <Colaboradores />}
          {!tenant && page === "marketplace" && <Marketplace />}
          {!tenant && page === "simulador" && <Simulador />}
          {!tenant && page === "rh" && <RH />}
          {!tenant && page === "banco" && <BancoParceiro />}
          {!tenant && page === "ia" && <IA />}
          {!tenant && page === "compliance" && <Compliance />}
          {!tenant && page === "relatorios" && <Relatorios />}
          {!tenant && page === "negocio" && <Negocio />}
          {tenant && page === "bi" && <EmpresaBI emp={tenant} />}
          {tenant && page === "ecolab" && <EmpresaColab emp={tenant} />}
          {tenant && page === "econsult" && <EmpresaConsultoria emp={tenant} />}
          {tenant && page === "erel" && <EmpresaRelatorios emp={tenant} />}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Overview */
function Overview() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Visão geral</h1>
        <p className="text-sm text-slate-500">Operação consolidada de todas as empresas conveniadas.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={Building2} label="Empresas cadastradas" value="148" delta={6} />
        <KPI icon={Users} label="Colaboradores elegíveis" value="48.920" delta={9} tone="green" />
        <KPI icon={FileText} label="Contratos ativos" value="2.232" delta={12} tone="green" />
        <KPI icon={Wallet} label="Volume contratado" value="R$ 1,14 bi" delta={14} tone="green" />
        <KPI icon={DollarSign} label="Receita da plataforma" value="R$ 7,9 mi" delta={11} tone="green" />
        <KPI icon={CreditCard} label="Ticket médio" value="R$ 26.400" delta={3} />
        <KPI icon={Clock} label="Solicitações pendentes" value="86" delta={-4} />
        <KPI icon={Percent} label="Receita recorrente (MRR)" value="R$ 1,14 mi" delta={8} tone="green" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold tracking-tight">Receita & crescimento mensal</h3>
            <Badge tone="green"><ArrowUpRight size={12} /> +14% MoM</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={RECEITA_MES}>
              <defs><linearGradient id="ov" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} formatter={(v) => [`R$ ${v} mil`, "Receita"]} />
              <Area type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={2.5} fill="url(#ov)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-1 font-semibold tracking-tight">Aprovações</h3>
          <p className="mb-2 text-xs text-slate-500">Últimos 30 dias</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={APROV} dataKey="v" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={3}>
                {APROV.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip {...tt()} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {APROV.map((a) => (
              <div key={a.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600"><span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />{a.name}</span>
                <span className="font-medium tabular-nums">{a.v}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Receita por banco</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={RECEITA_BANCO}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="nome" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} formatter={(v) => [`R$ ${v} mil`, "Receita"]} />
              <Bar dataKey="v" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Distribuição geográfica</h3>
          <div className="space-y-2.5">
            {UF_DIST.sort((a, b) => b.v - a.v).map((u) => (
              <div key={u.uf}>
                <div className="mb-1 flex justify-between text-xs"><span className="font-medium text-slate-600">{u.uf}</span><span className="text-slate-400 tabular-nums">{u.v.toLocaleString("pt-BR")}</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${(u.v / 4200) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Solicitações pendentes</h3>
          <div className="divide-y divide-slate-100">
            {COLAB.filter((c) => c.status === "Em análise").concat(COLAB.slice(0, 2)).slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-sm font-medium">{c.nome}</div>
                  <div className="text-xs text-slate-400">{c.empresa}</div>
                </div>
                <Badge tone="amber"><Clock size={11} /> Aguardando</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Drawer */
function Drawer({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-white shadow-2xl">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ Empresas */
function Empresas() {
  const [sel, setSel] = useState(null);
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div><h1 className="text-xl font-semibold tracking-tight">Empresas</h1><p className="text-sm text-slate-500">148 empresas conveniadas</p></div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={15} /> Nova empresa</button>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>{["Empresa", "Colab.", "Folha", "Convênio", "Bancos", "Volume", "Receita", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EMPRESAS.map((e) => (
                <tr key={e.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSel(e)}>
                  <td className="px-4 py-3"><div className="font-medium">{e.nome}</div><div className="text-xs text-slate-400">{e.setor} · {e.uf}</div></td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{e.colab.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{brl(e.folha)}</td>
                  <td className="px-4 py-3"><Badge tone={e.convenio === "Ativo" ? "green" : e.convenio === "Pausado" ? "amber" : "blue"}>{e.convenio}</Badge></td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{e.bancos}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{brl(e.volume)}</td>
                  <td className="px-4 py-3 font-medium tabular-nums text-emerald-600">{brl(e.receita)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(e.status)}>{e.status}</Badge></td>
                  <td className="px-4 py-3 text-slate-300"><ChevronRight size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer open={!!sel} onClose={() => setSel(null)}>
        {sel && (
          <div>
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
                <Badge tone={statusTone(sel.status)}>{sel.status}</Badge>
                <h2 className="mt-2 text-lg font-semibold tracking-tight">{sel.nome}</h2>
                <p className="text-sm text-slate-500">{sel.setor} · {sel.uf} · RH: {sel.rh}</p>
              </div>
              <button onClick={() => setSel(null)} className="rounded-lg p-1.5 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-3">
                {[["Colaboradores", sel.colab.toLocaleString("pt-BR")], ["Elegíveis", sel.elegiveis.toLocaleString("pt-BR")], ["Folha mensal", brl(sel.folha)], ["Volume contratado", brl(sel.volume)], ["Contratos ativos", sel.contratos], ["Receita mensal", brl(sel.receita)]].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-slate-50 p-3"><div className="text-base font-semibold tracking-tight tabular-nums">{v}</div><div className="text-xs text-slate-500">{l}</div></div>
                ))}
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Penetração de elegíveis</h3>
                <div className="h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${(sel.contratos / sel.elegiveis) * 100}%` }} /></div>
                <p className="mt-1 text-xs text-slate-500">{Math.round((sel.contratos / sel.elegiveis) * 100)}% dos elegíveis com contrato ativo</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Timeline</h3>
                <div className="space-y-3">
                  {[["Hoje", "12 novas simulações geradas"], ["Ontem", "Lote de averbação confirmado (R$ 420 mil)"], ["3 dias", "Convênio renovado por 12 meses"], ["Onboarding", "Integração da folha concluída"]].map(([d, t], i) => (
                    <div key={i} className="flex gap-3"><div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" /><div><div className="text-sm">{t}</div><div className="text-xs text-slate-400">{d}</div></div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ------------------------------------------------------------------ Colaboradores */
function Colaboradores() {
  const [sel, setSel] = useState(null);
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Colaboradores</h1><p className="text-sm text-slate-500">Base elegível com margem e score interno</p></div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>{["Nome", "Empresa", "Cargo", "Salário", "Tempo", "Margem", "Limite", "Banco", "Score", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COLAB.map((c) => (
                <tr key={c.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSel(c)}>
                  <td className="px-4 py-3 font-medium">{c.nome}</td>
                  <td className="px-4 py-3 text-slate-500">{c.empresa}</td>
                  <td className="px-4 py-3 text-slate-500">{c.cargo}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{brl(c.salario)}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-500">{c.tempo}a</td>
                  <td className="px-4 py-3 tabular-nums font-medium text-slate-700">{brl(c.margem)}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{brl(c.limite)}</td>
                  <td className="px-4 py-3 text-slate-500">{c.banco}</td>
                  <td className="px-4 py-3"><span className={cls("font-semibold tabular-nums", c.score > 800 ? "text-emerald-600" : c.score > 700 ? "text-blue-600" : "text-amber-600")}>{c.score}</span></td>
                  <td className="px-4 py-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                  <td className="px-4 py-3 text-slate-300"><ChevronRight size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer open={!!sel} onClose={() => setSel(null)}>
        {sel && (
          <div>
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">{sel.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                <div><h2 className="text-lg font-semibold tracking-tight">{sel.nome}</h2><p className="text-sm text-slate-500">{sel.cargo} · {sel.empresa}</p></div>
              </div>
              <button onClick={() => setSel(null)} className="rounded-lg p-1.5 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-3">
                {[["Salário", brl(sel.salario)], ["Tempo de empresa", sel.tempo + " anos"], ["Margem disponível", brl(sel.margem)], ["Limite", brl(sel.limite)], ["Score interno", sel.score], ["Banco atual", sel.banco]].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-slate-50 p-3"><div className="text-base font-semibold tracking-tight tabular-nums">{v}</div><div className="text-xs text-slate-500">{l}</div></div>
                ))}
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700"><Sparkles size={15} /> Recomendação da IA</div>
                <p className="mt-1 text-sm text-blue-900/80">Margem de {brl(sel.margem)} permite contrato de até {brl(sel.margem * 84 / 1.59 * 0.6)} em 84x. Melhor taxa atual: Crédito+ (1,59% a.m.).</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Histórico & atendimento</h3>
                <div className="space-y-3">
                  {[["Hoje", "Simulação de R$ 20.000 em 72x"], ["1 semana", "Documentação validada"], ["1 mês", "Score recalculado: " + sel.score], ["3 meses", "Cadastro elegível confirmado"]].map(([d, t], i) => (
                    <div key={i} className="flex gap-3"><div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" /><div><div className="text-sm">{t}</div><div className="text-xs text-slate-400">{d}</div></div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ------------------------------------------------------------------ Marketplace */
function Marketplace() {
  const [valor] = useState(20000);
  const [prazo] = useState(72);
  const offers = useMemo(() => BANKS.map((b) => {
    const i = b.taxa / 100;
    const parcela = pmt(valor, i, prazo);
    const cet = (b.taxa + (b.seguro ? 0.12 : 0.06)).toFixed(2);
    return { ...b, parcela, cet };
  }).sort((a, b) => a.parcela - b.parcela), [valor, prazo]);
  const best = offers[0];
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Marketplace de bancos</h1><p className="text-sm text-slate-500">Comparando {BANKS.length} propostas para {brl(valor)} em {prazo}x</p></div>
      <div className="grid gap-4 lg:grid-cols-2">
        {offers.map((o) => {
          const isBest = o.id === best.id;
          return (
            <Card key={o.id} className={cls("p-5", isBest && "ring-2 ring-blue-600")}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={cls("grid h-11 w-11 place-items-center rounded-xl text-sm font-bold text-white", o.color)}>{o.mono}</span>
                  <div><div className="font-semibold tracking-tight">{o.nome}</div><div className="text-xs text-slate-400">Aprovação em {o.tempo}</div></div>
                </div>
                {isBest && <Badge tone="blue"><BadgeCheck size={12} /> Melhor taxa</Badge>}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                {[["Taxa a.m.", o.taxa + "%"], ["CET a.m.", o.cet + "%"], ["Prazo", o.prazo + "x"], ["Parcela", brl(o.parcela)]].map(([l, v]) => (
                  <div key={l} className="rounded-lg bg-slate-50 py-2"><div className="text-sm font-semibold tabular-nums">{v}</div><div className="text-xs text-slate-400">{l}</div></div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-slate-500">{o.seguro ? <><ShieldCheck size={13} className="text-emerald-600" /> Com seguro prestamista</> : <>Sem seguro</>}</span>
                <button className={cls("rounded-lg px-3.5 py-2 text-sm font-semibold", isBest ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50")}>Contratar</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Simulador */
function Simulador() {
  const [salario, setSalario] = useState(7200);
  const [margemPct, setMargemPct] = useState(35);
  const [valor, setValor] = useState(20000);
  const [prazo, setPrazo] = useState(72);
  const margemRS = (salario * margemPct) / 100;
  const offers = useMemo(() => BANKS.map((b) => {
    const parcela = pmt(valor, b.taxa / 100, prazo);
    return { ...b, parcela, cabe: parcela <= margemRS };
  }).filter((o) => o.cabe).sort((a, b) => a.parcela - b.parcela), [valor, prazo, margemRS]);
  const best = offers[0];
  const worst = offers[offers.length - 1];
  const economia = best && worst ? (worst.parcela - best.parcela) * prazo : 0;
  const liquido = valor * 0.965; // IOF/tarifas aprox

  const Field = ({ label, value, set, min, max, step, fmt }) => (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm"><span className="text-slate-600">{label}</span><span className="font-semibold tabular-nums">{fmt(value)}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full accent-blue-600" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Simulador inteligente</h1><p className="text-sm text-slate-500">Ajuste os parâmetros e veja a melhor proposta em tempo real</p></div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="space-y-5 p-5 lg:col-span-2">
          <Field label="Salário mensal" value={salario} set={setSalario} min={1500} max={30000} step={100} fmt={brl} />
          <Field label="Margem consignável" value={margemPct} set={setMargemPct} min={5} max={40} step={1} fmt={(v) => v + "%"} />
          <Field label="Valor solicitado" value={valor} set={setValor} min={2000} max={Math.round(margemRS * prazo * 0.6)} step={500} fmt={brl} />
          <Field label="Prazo" value={prazo} set={setPrazo} min={12} max={96} step={6} fmt={(v) => v + "x"} />
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <Gauge value={best ? best.parcela : 0} max={margemRS} label={brl(margemRS)} sub="margem disponível / mês" />
            <p className="mt-1 text-xs text-slate-500">Comprometendo {best ? Math.round((best.parcela / margemRS) * 100) : 0}% da margem</p>
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {best ? (
            <Card className="border-blue-200 bg-blue-50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700"><BadgeCheck size={16} /> Melhor proposta — {best.nome}</div>
                <Badge tone="green">Economia de {brl(economia)}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[["Parcela", brl2(best.parcela)], ["Taxa a.m.", best.taxa + "%"], ["Valor líquido", brl(liquido)], ["Total", brl(best.parcela * prazo)]].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-white p-3"><div className="text-base font-semibold tracking-tight tabular-nums">{v}</div><div className="text-xs text-slate-500">{l}</div></div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-sm text-slate-500"><AlertTriangle className="mx-auto mb-2 text-amber-500" /> Nenhum banco cabe nessa margem. Reduza o valor ou aumente o prazo.</Card>
          )}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold">Bancos disponíveis ({offers.length})</div>
            <div className="divide-y divide-slate-100">
              {offers.map((o, i) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={cls("grid h-9 w-9 place-items-center rounded-lg text-xs font-bold text-white", o.color)}>{o.mono}</span>
                    <div><div className="text-sm font-medium">{o.nome}</div><div className="text-xs text-slate-400">{o.taxa}% a.m. · {prazo}x</div></div>
                  </div>
                  <div className="text-right"><div className="text-sm font-semibold tabular-nums">{brl2(o.parcela)}</div>{i === 0 && <span className="text-xs font-medium text-emerald-600">recomendado</span>}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ RH */
function RH() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Painel RH</h1><p className="text-sm text-slate-500">TechNova Sistemas · Marina Castro</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={Clock} label="Solicitações abertas" value="14" delta={-8} />
        <KPI icon={FileText} label="Contratos ativos" value="312" delta={5} tone="green" />
        <KPI icon={Users} label="Colaboradores elegíveis" value="980" delta={2} />
        <KPI icon={CheckCircle2} label="Contratos finalizados" value="58" delta={11} tone="green" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold tracking-tight">Solicitações para averbação</h3>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50"><Download size={13} /> Excel</button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium hover:bg-slate-50"><FileText size={13} /> PDF</button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {COLAB.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                <div><div className="font-medium">{c.nome}</div><div className="text-xs text-slate-400">{c.cargo} · margem {brl(c.margem)}</div></div>
                <div className="flex items-center gap-2">
                  <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                  <button className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700">Averbar</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Alertas & pendências</h3>
          <div className="space-y-3 text-sm">
            {[["amber", "3 documentos vencendo em 48h"], ["rose", "1 margem estourada — revisar"], ["blue", "12 colaboradores novos elegíveis"], ["green", "Lote de averbação confirmado"]].map(([t, x], i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3">
                <span className={cls("mt-1 h-2 w-2 shrink-0 rounded-full", t === "amber" ? "bg-amber-500" : t === "rose" ? "bg-rose-500" : t === "blue" ? "bg-blue-500" : "bg-emerald-500")} />
                <span className="text-slate-700">{x}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Banco parceiro */
function BancoParceiro() {
  const ranking = [...EMPRESAS].sort((a, b) => b.volume - a.volume).slice(0, 5);
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Painel do banco parceiro</h1><p className="text-sm text-slate-500">Banco Crédito+ · carteira e produção</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={Building2} label="Empresas conveniadas" value="62" delta={7} />
        <KPI icon={Wallet} label="Carteira ativa" value="R$ 312 mi" delta={9} tone="green" />
        <KPI icon={Activity} label="Produção mensal" value="R$ 28,4 mi" delta={12} tone="green" />
        <KPI icon={Percent} label="Taxa de aprovação" value="71%" delta={3} tone="green" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-3 font-semibold tracking-tight">Produção diária (últimos 14 dias)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={Array.from({ length: 14 }, (_, i) => ({ d: i + 1, v: 1200 + Math.round(Math.sin(i) * 400 + i * 120) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} formatter={(v) => [`R$ ${v} mil`, "Produção"]} />
              <Bar dataKey="v" fill="#2563EB" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Ranking de empresas</h3>
          <div className="space-y-2.5">
            {ranking.map((e, i) => (
              <div key={e.id} className="flex items-center gap-3">
                <span className={cls("grid h-6 w-6 place-items-center rounded-full text-xs font-bold", i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500")}>{i + 1}</span>
                <div className="flex-1"><div className="text-sm font-medium">{e.nome}</div></div>
                <div className="text-sm font-semibold tabular-nums">{brl(e.volume)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div><div className="text-lg font-semibold tabular-nums">R$ 27,1k</div><div className="text-xs text-slate-400">Ticket médio</div></div>
            <div><div className="text-lg font-semibold tabular-nums text-rose-600">1,8%</div><div className="text-xs text-slate-400">Inadimplência</div></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ IA */
const IA_QA = {
  "Qual empresa possui maior potencial?": () => {
    const e = [...EMPRESAS].map((x) => ({ ...x, pot: x.elegiveis - x.contratos })).sort((a, b) => b.pot - a.pot)[0];
    return `${e.nome} tem o maior potencial inexplorado: ${e.elegiveis.toLocaleString("pt-BR")} elegíveis e apenas ${e.contratos} contratos ativos — ${(e.elegiveis - e.contratos).toLocaleString("pt-BR")} colaboradores ainda sem crédito ofertado. Estimo um volume potencial adicional de ${brl((e.elegiveis - e.contratos) * 26400)}.`;
  },
  "Quais colaboradores têm margem disponível?": () => {
    const list = COLAB.filter((c) => c.banco === "—").map((c) => `${c.nome} (${brl(c.margem)})`);
    return `${list.length} colaboradores com margem livre e sem contrato: ${list.join(", ")}. Recomendo campanha dirigida — taxa de conversão média desse perfil é de 34%.`;
  },
  "Qual banco aprovou mais contratos?": () => "Banco Crédito+ lidera com 712 contratos no mês (32% do total), seguido por Daycred (540). A melhor taxa média de aprovação é da Crédito+ (71%).",
  "Qual empresa possui maior conversão?": () => {
    const e = [...EMPRESAS].map((x) => ({ ...x, conv: x.contratos / x.elegiveis })).sort((a, b) => b.conv - a.conv)[0];
    return `${e.nome} converte ${Math.round((e.contratos / e.elegiveis) * 100)}% dos elegíveis em contratos — a maior da base. O fator principal é o engajamento do RH (${e.rh}) e 6 bancos habilitados.`;
  },
  "Gere previsão de receita": () => "Com o crescimento atual de +14% MoM, projeto receita de R$ 1,31 mi no próximo mês e R$ 9,4 mi no acumulado de 12 meses (cenário base). No cenário otimista, com 20 novas empresas: R$ 11,8 mi.",
  "Crie um resumo para a diretoria": () => "Resumo executivo: 148 empresas conveniadas, 48.920 elegíveis, 2.232 contratos ativos e R$ 1,14 bi em volume. Receita de R$ 7,9 mi (+11%). Aprovação de 68%. Maior alavanca: ativar elegíveis dormentes na Supermercados BomPreço e Rede Vida Saúde.",
};

function IA() {
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Olá, Tiago. Sou a inteligência da GranaControl. Posso analisar empresas, colaboradores, bancos e gerar relatórios. O que você quer saber?" }]);
  const [input, setInput] = useState("");
  const ask = (q) => {
    const answer = IA_QA[q] ? IA_QA[q]() : "Posso analisar os dados da plataforma — tente uma das sugestões abaixo, ou pergunte sobre uma empresa, banco ou colaborador específico.";
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: answer }]);
    setInput("");
  };
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Inteligência GranaControl</h1><p className="text-sm text-slate-500">Pergunte em linguagem natural sobre toda a operação</p></div>
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="flex flex-col lg:col-span-3" style={{ height: 460 }}>
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div key={i} className={cls("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div style={{ maxWidth: "80%" }} className={cls("rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800")}>
                  {m.role === "ai" && <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-blue-600"><Sparkles size={12} /> IA</span>}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input && ask(input)}
              placeholder="Pergunte algo…" className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none placeholder:text-slate-400" />
            <button onClick={() => input && ask(input)} className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"><Send size={16} /></button>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-2 text-sm font-semibold">Sugestões</h3>
          <div className="space-y-1.5">
            {Object.keys(IA_QA).map((q) => (
              <button key={q} onClick={() => ask(q)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">
                <MessageSquare size={14} className="shrink-0 text-blue-500" /><span>{q}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Compliance */
function Compliance() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Compliance & governança</h1><p className="text-sm text-slate-500">LGPD, auditoria e controle de acesso</p></div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-3 font-semibold tracking-tight">Trilha de auditoria (logs)</h3>
          <div className="divide-y divide-slate-100 text-sm">
            {[
              ["10:42", "Tiago Tuma", "Exportou relatório de contratos (PDF)", "blue"],
              ["10:18", "Marina Castro", "Averbou contrato #4821 — TechNova", "green"],
              ["09:55", "Sistema", "Consentimento LGPD registrado — 12 colaboradores", "slate"],
              ["09:30", "Banco Crédito+", "Acessou base elegível (mascarada)", "slate"],
              ["08:47", "Sistema", "Tentativa de acesso bloqueada (IP não autorizado)", "rose"],
            ].map(([h, u, a, t], i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <span className="w-12 text-xs text-slate-400 tabular-nums">{h}</span>
                <span className={cls("h-2 w-2 shrink-0 rounded-full", t === "green" ? "bg-emerald-500" : t === "rose" ? "bg-rose-500" : t === "blue" ? "bg-blue-500" : "bg-slate-300")} />
                <span className="font-medium">{u}</span>
                <span className="text-slate-500">{a}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Controles de acesso (RBAC)</h3>
          <div className="space-y-2.5 text-sm">
            {[["Administrador", "Acesso total", "green"], ["RH empresa", "Dados da própria empresa", "blue"], ["Banco parceiro", "Base mascarada + propostas", "blue"], ["Colaborador", "Apenas dados próprios", "slate"]].map(([r, d, t]) => (
              <div key={r} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div><div className="font-medium">{r}</div><div className="text-xs text-slate-400">{d}</div></div>
                <Badge tone={t}>OK</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[[Lock, "Criptografia AES-256"], [ScrollText, "LGPD compliant"], [Activity, "Logs imutáveis"], [Users, "MFA ativo"]].map(([Ic, t]) => (
          <Card key={t} className="flex items-center gap-3 p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Ic size={17} /></span><div className="text-sm font-medium">{t}</div><Check size={16} className="ml-auto text-emerald-600" /></Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Relatórios */
function Relatorios() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div><h1 className="text-xl font-semibold tracking-tight">Relatórios executivos</h1><p className="text-sm text-slate-500">Indicadores financeiros e operacionais</p></div>
        <div className="flex gap-2">
          {[["Excel", Download], ["PDF", FileText], ["Power BI", Layers]].map(([t, Ic]) => (
            <button key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"><Ic size={15} /> {t}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={DollarSign} label="Receita acumulada" value="R$ 7,9 mi" delta={11} tone="green" />
        <KPI icon={Wallet} label="Volume contratado" value="R$ 1,14 bi" delta={14} tone="green" />
        <KPI icon={Percent} label="Conversão média" value="29%" delta={4} tone="green" />
        <KPI icon={CreditCard} label="Carteira ativa" value="R$ 312 mi" delta={6} tone="green" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Receita por empresa (top 6)</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart layout="vertical" data={[...EMPRESAS].sort((a, b) => b.receita - a.receita).slice(0, 6).map((e) => ({ nome: e.nome.split(" ")[0], v: e.receita / 1000 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nome" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip {...tt()} formatter={(v) => [`R$ ${v} mil`, "Receita"]} />
              <Bar dataKey="v" fill="#2563EB" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Receita recorrente vs crescimento</h3>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={RECEITA_MES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} formatter={(v) => [`R$ ${v} mil`, "MRR"]} />
              <Line type="monotone" dataKey="v" stroke="#059669" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Negócio / MVP */
function Negocio() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-semibold tracking-tight">Negócio, MVP & estratégia</h1><p className="text-sm text-slate-500">O que torna a GranaControl investível</p></div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold tracking-tight">MVP — Versão 1 (0–4 meses)</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            {["Cadastro de empresas + integração de folha (CSV/API)", "Base elegível com cálculo automático de margem", "Marketplace com 3–6 bancos e simulador", "Jornada digital do colaborador + assinatura eletrônica", "Painel RH com averbação e exportação", "Dashboard executivo e LGPD/RBAC"].map((x) => (
              <li key={x} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-emerald-600" />{x}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold tracking-tight">Versão 2 (4–9 meses)</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            {["IA generativa para relatórios e previsão de receita", "App mobile nativo + push de margem disponível", "Score de crédito interno e antifraude", "Painel do banco parceiro com produção em tempo real", "Educação financeira e open finance", "Webhooks e marketplace de APIs"].map((x) => (
              <li key={x} className="flex gap-2"><Plus size={15} className="mt-0.5 shrink-0 text-blue-600" />{x}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-semibold tracking-tight">Roadmap 12 meses</h3>
        <div className="grid gap-3 sm:grid-cols-4">
          {[["Q1", "MVP & 5 empresas piloto", "blue"], ["Q2", "5 bancos + assinatura e averbação", "blue"], ["Q3", "IA, app mobile, 50 empresas", "green"], ["Q4", "Open finance, escala nacional", "green"]].map(([q, t, c]) => (
            <div key={q} className="rounded-xl border border-slate-200 p-4">
              <span className={cls("text-xs font-bold", c === "green" ? "text-emerald-600" : "text-blue-600")}>{q}</span>
              <p className="mt-1 text-sm text-slate-600">{t}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold tracking-tight"><Cpu size={17} className="text-blue-600" /> Arquitetura</h3>
          <div className="space-y-2 text-sm text-slate-600">
            {[["Frontend", "React / Next.js · app mobile React Native"], ["Backend", "API Node/NestJS · microsserviços"], ["Dados", "PostgreSQL + Redis · data lake p/ BI"], ["Integrações", "APIs de folha, bancos, assinatura, bureaus"], ["Infra", "Cloud (AWS) · filas, observabilidade, RBAC"]].map(([k, v]) => (
              <div key={k} className="flex gap-3 rounded-lg bg-slate-50 p-3"><span className="w-24 shrink-0 font-medium text-slate-800">{k}</span><span>{v}</span></div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold tracking-tight"><Database size={17} className="text-blue-600" /> Modelo de monetização (SaaS)</h3>
          <div className="space-y-2 text-sm text-slate-600">
            {[["Take-rate", "% sobre cada contrato originado (bancos)"], ["Assinatura", "Mensalidade por empresa / faixas de colaboradores"], ["Lead fee", "Taxa por proposta enviada ao marketplace"], ["Float & dados", "Serviços de BI e antifraude para parceiros"]].map(([k, v]) => (
              <div key={k} className="flex gap-3 rounded-lg bg-slate-50 p-3"><span className="w-24 shrink-0 font-medium text-slate-800">{k}</span><span>{v}</span></div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["Pitch p/ empresas", "Reduza 80% do trabalho do RH com consignado privado e ofereça um benefício de alto valor — sem custo e sem risco de crédito para a empresa.", Building2],
          ["Pitch p/ bancos", "Acesse carteiras corporativas pré-qualificadas com margem averbável e CAC próximo de zero. Distribuição em escala via marketplace.", Landmark],
          ["Pitch p/ investidores", "Plataforma asset-light em um mercado de R$ 60 bi+ no consignado, com receita recorrente, take-rate por contrato e efeito de rede entre empresas e bancos.", Rocket],
        ].map(([t, d, Ic]) => (
          <Card key={t} className="p-5">
            <Ic size={20} className="text-blue-600" />
            <h3 className="mt-2 font-semibold tracking-tight">{t}</h3>
            <p className="mt-1 text-sm text-slate-600">{d}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== MOBILE */
function Mobile({ go }) {
  const [tab, setTab] = useState("home");
  const colab = COLAB[0];
  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="mx-auto w-full max-w-sm px-4">
        <button onClick={() => go("landing")} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"><ChevronLeft size={16} /> Voltar ao site</button>
        <div className="overflow-hidden rounded-3xl border-8 border-slate-900 bg-white shadow-2xl">
          {/* status bar */}
          <div className="flex items-center justify-between bg-slate-900 px-6 py-2 text-xs text-white"><span>9:41</span><span className="flex gap-1"><span>5G</span><span>100%</span></span></div>

          <div className="overflow-y-auto" style={{ height: 560 }}>
            {tab === "home" && (
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between"><Logo /><Bell size={18} className="text-slate-400" /></div>
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                  <p className="text-sm text-blue-100">Margem disponível</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">{brl(colab.margem)}</p>
                  <p className="mt-1 text-xs text-blue-200">Limite estimado: {brl(colab.limite)}</p>
                  <button onClick={() => setTab("simular")} className="mt-4 w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-blue-700">Simular crédito</button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[[Calculator, "Simular", "simular"], [Store, "Bancos", "market"], [CreditCard, "Parcelas", "parcelas"]].map(([Ic, l, t]) => (
                    <button key={l} onClick={() => setTab(t)} className="rounded-2xl border border-slate-200 py-3"><Ic size={18} className="mx-auto text-blue-600" /><div className="mt-1 text-xs text-slate-600">{l}</div></button>
                  ))}
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold"><GraduationCap size={16} className="text-blue-600" /> Educação financeira</div>
                  <p className="mt-1 text-xs text-slate-500">Aprenda a usar o consignado a seu favor — 3 min.</p>
                  <button className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600"><Play size={12} /> Assistir</button>
                </div>
              </div>
            )}
            {tab === "simular" && (
              <div className="space-y-4 p-5">
                <h2 className="text-lg font-semibold tracking-tight">Simular crédito</h2>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Valor desejado</p>
                  <p className="text-2xl font-semibold tracking-tight">{brl(20000)}</p>
                  <div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-2 w-1/2 rounded-full bg-blue-600" /></div>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs font-semibold text-blue-700">Melhor proposta</p>
                  <p className="mt-1 font-semibold">Banco Crédito+ · 1,59% a.m.</p>
                  <p className="text-sm text-slate-600">72x de {brl2(pmt(20000, 0.0159, 72))}</p>
                  <button className="mt-3 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white">Contratar agora</button>
                </div>
              </div>
            )}
            {tab === "market" && (
              <div className="space-y-3 p-5">
                <h2 className="text-lg font-semibold tracking-tight">Marketplace</h2>
                {BANKS.slice(0, 4).map((b) => (
                  <div key={b.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                    <span className={cls("grid h-9 w-9 place-items-center rounded-lg text-xs font-bold text-white", b.color)}>{b.mono}</span>
                    <div className="flex-1"><div className="text-sm font-medium">{b.nome}</div><div className="text-xs text-slate-400">{b.taxa}% a.m. · {b.prazo}x</div></div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                ))}
              </div>
            )}
            {tab === "parcelas" && (
              <div className="space-y-3 p-5">
                <h2 className="text-lg font-semibold tracking-tight">Minhas parcelas</h2>
                <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs text-emerald-700">Contrato ativo · Crédito+</p><p className="font-semibold">18 de 72 pagas</p><div className="mt-2 h-2 rounded-full bg-emerald-200"><div className="h-2 rounded-full bg-emerald-600" style={{ width: "25%" }} /></div></div>
                {[["Jul/26", "Paga"], ["Ago/26", "Em aberto"], ["Set/26", "Futura"]].map(([m, s]) => (
                  <div key={m} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 text-sm"><span>{m}</span><span className="font-medium tabular-nums">{brl2(pmt(20000, 0.0159, 72))}</span><Badge tone={s === "Paga" ? "green" : s === "Em aberto" ? "amber" : "slate"}>{s}</Badge></div>
                ))}
              </div>
            )}
            {tab === "perfil" && (
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-3"><span className="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-lg font-semibold text-white">AB</span><div><div className="font-semibold">{colab.nome}</div><div className="text-xs text-slate-500">{colab.cargo}</div></div></div>
                {[["Empresa", colab.empresa], ["Score", colab.score], ["Margem", brl(colab.margem)], ["Suporte", "Falar com atendimento"]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 text-sm"><span className="text-slate-500">{l}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>
            )}
          </div>

          {/* bottom tabs */}
          <div className="flex items-center justify-around border-t border-slate-100 bg-white py-2">
            {[[Home, "home"], [Calculator, "simular"], [Store, "market"], [CreditCard, "parcelas"], [User, "perfil"]].map(([Ic, t]) => (
              <button key={t} onClick={() => setTab(t)} className={cls("grid place-items-center rounded-lg px-3 py-1.5", tab === t ? "text-blue-600" : "text-slate-400")}><Ic size={20} /></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== ACESSOS POR CNPJ (admin) */
function AcessosCNPJ({ onEnter }) {
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Acessos por CNPJ</h1><p className="text-sm text-slate-500">Cada empresa recebe um portal próprio de BI e consultoria — vê apenas os seus colaboradores.</p></div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-white"><Eye size={17} /></span>
          <div className="text-sm text-blue-900/80">
            <span className="font-semibold text-blue-700">Granatech enxerga toda a carteira.</span> Você pode entrar na visão de qualquer empresa para dar suporte. A empresa, ao logar pelo CNPJ, acessa só o próprio portal — colaboradores, margens, contratos e o BI da consultoria.
          </div>
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>{["Empresa", "CNPJ", "RH responsável", "Colaboradores", "Portal", "Último acesso", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {EMPRESAS.map((e, i) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3"><div className="font-medium">{e.nome}</div><div className="text-xs text-slate-400">{e.setor} · {e.uf}</div></td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{e.cnpj}</td>
                  <td className="px-4 py-3 text-slate-600">{e.rh}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{e.colab.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3"><Badge tone={e.portal === "Ativo" ? "green" : e.portal === "Convidado" ? "blue" : "amber"}>{e.portal}</Badge></td>
                  <td className="px-4 py-3 text-slate-500">{["há 2h", "ontem", "há 5 dias", "—", "há 1h", "há 3 dias", "—", "há 6h"][i]}</td>
                  <td className="px-4 py-3 text-right">
                    {e.portal === "Pausado" ? (
                      <span className="text-xs text-slate-400">Portal pausado</span>
                    ) : (
                      <button onClick={() => onEnter(e)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        <ArrowLeftRight size={13} /> Entrar como empresa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ stats por empresa */
function empStats(emp) {
  const list = colabsOf(emp);
  const avgMargem = list.reduce((a, c) => a + c.margem, 0) / list.length;
  const margemTotal = Math.round(avgMargem * emp.elegiveis);
  const pen = Math.round((emp.contratos / emp.elegiveis) * 100);
  const economia = emp.contratos * 2800;
  const semOferta = emp.elegiveis - emp.contratos;
  const statusDist = ["Contrato ativo", "Elegível", "Em análise"].map((s, i) => ({
    name: s, v: list.filter((c) => c.status === s).length, color: ["#059669", "#2563EB", "#F59E0B"][i],
  }));
  const faixas = [
    { f: "Até 3k", min: 0, max: 3000 }, { f: "3–6k", min: 3000, max: 6000 },
    { f: "6–10k", min: 6000, max: 10000 }, { f: ">10k", min: 10000, max: 1e9 },
  ].map((b) => ({ f: b.f, v: Math.round(list.filter((c) => c.salario >= b.min && c.salario < b.max).reduce((a, c) => a + c.margem, 0) / 1000) }));
  const evol = Array.from({ length: 12 }, (_, i) => ({ m: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i], v: Math.round(emp.contratos * (0.35 + (i / 11) * 0.65)) }));
  const bancosDist = BANKS.slice(0, emp.bancos).map((b, i) => ({ nome: b.mono, v: Math.round(emp.contratos * [0.28, 0.22, 0.18, 0.14, 0.1, 0.08][i]) }));
  return { list, avgMargem, margemTotal, pen, economia, semOferta, statusDist, faixas, evol, bancosDist };
}

/* ------------------------------------------------------------------ Empresa BI */
function EmpresaBI({ emp }) {
  const s = empStats(emp);
  const benchmark = 29;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{emp.nome} — Visão BI</h1>
          <p className="text-sm text-slate-500 tabular-nums">CNPJ {emp.cnpj} · consultoria GranaControl</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none"><option>Últimos 12 meses</option><option>Este ano</option><option>Último trimestre</option></select>
          {[["Excel", Download], ["PDF", FileText], ["Power BI", Layers]].map(([t, Ic]) => (
            <button key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"><Ic size={15} /> {t}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPI icon={Users} label="Colaboradores" value={emp.colab.toLocaleString("pt-BR")} />
        <KPI icon={BadgeCheck} label="Elegíveis" value={emp.elegiveis.toLocaleString("pt-BR")} tone="green" />
        <KPI icon={Wallet} label="Margem disponível" value={brl(s.margemTotal)} />
        <KPI icon={FileText} label="Contratos ativos" value={emp.contratos.toLocaleString("pt-BR")} delta={9} tone="green" />
        <KPI icon={CreditCard} label="Volume contratado" value={brl(emp.volume)} delta={12} tone="green" />
        <KPI icon={TrendingUp} label="Economia aos colab." value={brl(s.economia)} tone="green" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-3 font-semibold tracking-tight">Evolução de contratos ativos</h3>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={s.evol}>
              <defs><linearGradient id="eb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} formatter={(v) => [v, "Contratos"]} />
              <Area type="monotone" dataKey="v" stroke="#2563EB" strokeWidth={2.5} fill="url(#eb)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="mb-1 font-semibold tracking-tight">Penetração vs. carteira</h3>
          <p className="mb-4 text-xs text-slate-500">% de elegíveis com contrato</p>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{emp.nome.split(" ")[0]}</span><span className="font-semibold tabular-nums">{s.pen}%</span></div>
              <div className="h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-blue-600" style={{ width: `${s.pen}%` }} /></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm"><span className="text-slate-500">Média da carteira</span><span className="tabular-nums text-slate-500">{benchmark}%</span></div>
              <div className="h-2.5 rounded-full bg-slate-100"><div className="h-2.5 rounded-full bg-slate-300" style={{ width: `${benchmark}%` }} /></div>
            </div>
          </div>
          <div className={cls("mt-4 rounded-xl p-3 text-sm", s.pen >= benchmark ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>
            {s.pen >= benchmark ? `Acima da média em ${s.pen - benchmark} p.p.` : `Abaixo da média em ${benchmark - s.pen} p.p. — oportunidade de ativação.`}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Status dos colaboradores</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={s.statusDist} dataKey="v" nameKey="name" innerRadius={45} outerRadius={68} paddingAngle={3}>{s.statusDist.map((e) => <Cell key={e.name} fill={e.color} />)}</Pie>
              <Tooltip {...tt()} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {s.statusDist.map((a) => (<div key={a.name} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-slate-600"><span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />{a.name}</span><span className="font-medium tabular-nums">{a.v}</span></div>))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Margem por faixa salarial</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={s.faixas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="f" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} formatter={(v) => [`R$ ${v} mil`, "Margem"]} />
              <Bar dataKey="v" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 font-semibold tracking-tight">Contratos por banco</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={s.bancosDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="nome" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip {...tt()} formatter={(v) => [v, "Contratos"]} />
              <Bar dataKey="v" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Empresa Colaboradores (escopado) */
function EmpresaColab({ emp }) {
  const list = colabsOf(emp);
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState("");
  const filtered = list.filter((c) => c.nome.toLowerCase().includes(q.toLowerCase()) || c.cargo.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-xl font-semibold tracking-tight">Meus colaboradores</h1><p className="text-sm text-slate-500">{emp.nome} · somente colaboradores deste CNPJ</p></div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
          <Search size={15} className="text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nome ou cargo" className="w-44 outline-none placeholder:text-slate-400" />
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>{["Nome", "Cargo", "Salário", "Tempo", "Margem", "Limite", "Banco", "Score", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSel(c)}>
                  <td className="px-4 py-3 font-medium">{c.nome}</td>
                  <td className="px-4 py-3 text-slate-500">{c.cargo}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{brl(c.salario)}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-500">{c.tempo}a</td>
                  <td className="px-4 py-3 tabular-nums font-medium text-slate-700">{brl(c.margem)}</td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">{brl(c.limite)}</td>
                  <td className="px-4 py-3 text-slate-500">{c.banco}</td>
                  <td className="px-4 py-3"><span className={cls("font-semibold tabular-nums", c.score > 800 ? "text-emerald-600" : c.score > 700 ? "text-blue-600" : "text-amber-600")}>{c.score}</span></td>
                  <td className="px-4 py-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                  <td className="px-4 py-3 text-slate-300"><ChevronRight size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Drawer open={!!sel} onClose={() => setSel(null)}>
        {sel && (
          <div>
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">{sel.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}</span>
                <div><h2 className="text-lg font-semibold tracking-tight">{sel.nome}</h2><p className="text-sm text-slate-500">{sel.cargo} · {emp.nome}</p></div>
              </div>
              <button onClick={() => setSel(null)} className="rounded-lg p-1.5 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-5">
              {[["Salário", brl(sel.salario)], ["Tempo", sel.tempo + " anos"], ["Margem disponível", brl(sel.margem)], ["Limite", brl(sel.limite)], ["Score", sel.score], ["Banco atual", sel.banco]].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-slate-50 p-3"><div className="text-base font-semibold tracking-tight tabular-nums">{v}</div><div className="text-xs text-slate-500">{l}</div></div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

/* ------------------------------------------------------------------ Empresa Consultoria */
function EmpresaConsultoria({ emp }) {
  const s = empStats(emp);
  const benchmark = 29;
  const potencial = s.semOferta * 26400;
  const diag = Math.min(100, Math.round((s.pen / benchmark) * 70 + 30));
  const insights = [
    [Activity, `${s.semOferta.toLocaleString("pt-BR")} colaboradores elegíveis ainda sem oferta`, `Representam ${brl(potencial)} em volume potencial e ${brl(s.semOferta * 2800)} de economia não capturada.`, "blue"],
    [TrendingUp, s.pen >= benchmark ? "Penetração acima da média da carteira" : "Penetração abaixo da média da carteira", `Sua empresa está em ${s.pen}% vs. ${benchmark}% da média. ${s.pen >= benchmark ? "Mantenha a comunicação ativa." : "Recomendamos uma campanha interna de divulgação."}`, s.pen >= benchmark ? "green" : "amber"],
    [Wallet, "Maior margem ociosa concentrada nas faixas altas", `As faixas acima de R$ 6 mil somam ${brl((s.faixas[2].v + s.faixas[3].v) * 1000)} de margem livre — público de maior ticket e menor risco.`, "blue"],
    [ShieldCheck, "Governança e compliance em dia", "100% dos contratos com averbação validada e consentimento LGPD registrado. Nenhuma margem estourada no período.", "green"],
  ];
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-semibold tracking-tight">Consultoria GranaControl</h1><p className="text-sm text-slate-500">{emp.nome} · diagnóstico e recomendações para mais controle</p></div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-5">
          <h3 className="mb-2 text-sm font-semibold text-slate-500">Índice de saúde do benefício</h3>
          <Gauge value={diag} max={100} label={diag + "/100"} sub={diag >= 70 ? "Saudável" : "Requer atenção"} />
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-3 font-semibold tracking-tight">Oportunidades priorizadas</h3>
          <div className="space-y-3">
            {[["Ativar elegíveis sem oferta", potencial, "Alta"], ["Campanha faixa R$6k+", (s.faixas[2].v + s.faixas[3].v) * 1000 * 8, "Alta"], ["Renegociar contratos antigos", emp.contratos * 600, "Média"]].map(([t, v, p], i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div><div className="text-sm font-medium">{t}</div><div className="text-xs text-slate-400">Impacto estimado: {brl(v)}</div></div>
                <Badge tone={p === "Alta" ? "rose" : "amber"}>{p}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {insights.map(([Ic, t, d, tone], i) => (
          <Card key={i} className="p-5">
            <span className={cls("grid h-9 w-9 place-items-center rounded-xl", tone === "green" ? "bg-emerald-50 text-emerald-600" : tone === "amber" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600")}><Ic size={17} /></span>
            <h3 className="mt-3 font-semibold tracking-tight">{t}</h3>
            <p className="mt-1 text-sm text-slate-600">{d}</p>
          </Card>
        ))}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3 border-blue-200 bg-blue-50 p-5">
        <div className="flex items-center gap-3"><Sparkles className="text-blue-600" /><div className="text-sm text-blue-900/80"><span className="font-semibold text-blue-700">Relatório de consultoria pronto.</span> Resumo executivo com diagnóstico, oportunidades e plano de ação para a diretoria.</div></div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Download size={15} /> Gerar relatório (PDF)</button>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ Empresa Relatórios */
function EmpresaRelatorios({ emp }) {
  const s = empStats(emp);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-xl font-semibold tracking-tight">Relatórios</h1><p className="text-sm text-slate-500">{emp.nome} · exportação e indicadores</p></div>
        <div className="flex gap-2">{[["Excel", Download], ["PDF", FileText], ["Power BI", Layers]].map(([t, Ic]) => (<button key={t} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50"><Ic size={15} /> {t}</button>))}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={FileText} label="Contratos ativos" value={emp.contratos.toLocaleString("pt-BR")} delta={9} tone="green" />
        <KPI icon={Wallet} label="Volume contratado" value={brl(emp.volume)} delta={12} tone="green" />
        <KPI icon={Percent} label="Penetração" value={s.pen + "%"} delta={3} tone="green" />
        <KPI icon={TrendingUp} label="Economia gerada" value={brl(s.economia)} tone="green" />
      </div>
      <Card className="p-5">
        <h3 className="mb-3 font-semibold tracking-tight">Volume contratado por mês</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={s.evol.map((d) => ({ m: d.m, v: Math.round(d.v * 26.4) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip {...tt()} formatter={(v) => [`R$ ${v} mil`, "Volume"]} />
            <Bar dataKey="v" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/* ================================================================== ROOT */
export default function GranaControl() {
  const [surface, setSurface] = useState("landing");
  if (surface === "app") return <App go={setSurface} />;
  if (surface === "mobile") return <Mobile go={setSurface} />;
  return <Landing go={setSurface} />;
}
