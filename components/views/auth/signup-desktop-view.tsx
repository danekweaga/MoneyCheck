import Image from "next/image";
import { SignupForm } from "@/components/auth/signup-form";

const textureImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDjlmrqVrTRDX85dCPiTfprTLQhCpJaA4cuiRDHvVpPtzT8JsaDmwbdIQiHmFEQUC7PvlRPlDNMPeJXWKabdrtJOOm-_gbsRZsWEO1GN_ehD6POhfIYfdKBU8bcU8_DdPfEYEj21XbpaxuI9NJ11L23njlFjwuSCGDvh83DEVPeoehHTQqnx6FDRCgjNogsW-CsR2m5rtqqD64vR-9svLiN1_MZKAAigXqRR-6U0mcYcH4trdg5xHt5lXyXIshlk6iEsvYX5jLB8dkL";
const avatarImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0kRz_RuI_XNmUWbXnoju1a-IidT_tCvsNbcv9ReWfVe7WD0uO1e0KzIjj6124Vl-JRGawRfp4ujWg2shQ4K_ivnJPmy2gRrn20M4ve8Koxus0nGMESJQ2A24rVGuJ-sNi-S5dElEXQ37IRIiSAawjFn2Ay3LLK9Zf9ic_khbrlHh9rtoQUdcnRnyu4yRK15J610U3W3qeGDL27oV5b7aunvJbr4nvvgsH9uEqQLUVYGXEP3hT6SQaxHj1x48Tob66dwVNFWc11F";

export function SignupDesktopView() {
  return (
    <main className="grid min-h-screen grid-cols-1 overflow-hidden bg-surface lg:grid-cols-12">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-16 text-on-primary lg:col-span-5 lg:flex">
        <div className="absolute -right-[10%] -top-[10%] h-96 w-96 rounded-full bg-secondary opacity-20 blur-[100px]" />
        <div className="absolute -bottom-[5%] -left-[5%] h-64 w-64 rounded-full bg-primary-container opacity-40 blur-[80px]" />
        <div className="relative z-10">
          <div className="mb-16 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed">
              <span className="material-symbols-outlined text-on-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <span className="font-headline text-2xl font-extrabold tracking-tight text-white">MoneyCheck</span>
          </div>
          <h1 className="font-headline mb-6 max-w-md text-5xl font-extrabold leading-tight">Your financial future starts here.</h1>
          <p className="max-w-sm text-lg font-medium leading-relaxed text-primary-fixed">
            Join over 50,000 users who have transformed their relationship with money through editorial financial intelligence.
          </p>
        </div>
        <div className="relative z-10">
          <div className="rounded-xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
            <div className="mb-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="material-symbols-outlined text-sm text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
            </div>
            <p className="mb-6 font-medium italic text-white">
              &quot;MoneyCheck didn&apos;t just give me charts; it gave me a strategy. I finally feel in control of my portfolio.&quot;
            </p>
            <div className="flex items-center gap-4">
              <Image src={avatarImg} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" unoptimized />
              <div>
                <p className="text-sm font-bold text-white">Marcus Thorne</p>
                <p className="text-xs text-primary-fixed/80">Senior Portfolio Manager</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
          <Image src={textureImg} alt="" width={1200} height={800} className="h-full w-full object-cover" unoptimized />
        </div>
      </section>
      <section className="col-span-1 flex flex-col items-center justify-center bg-surface p-8 lg:col-span-7 lg:p-24">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <span className="material-symbols-outlined text-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <span className="font-headline text-xl font-extrabold tracking-tight text-primary">MoneyCheck</span>
          </div>
          <SignupForm variant="desktop" />
          <footer className="mt-16 text-center">
            <p className="text-[10px] font-medium uppercase tracking-widest text-outline">
              © {new Date().getFullYear()} MoneyCheck. Editorial Financial Intelligence.
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
