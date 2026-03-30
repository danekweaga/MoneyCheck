import Image from "next/image";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { AppFooter } from "@/components/layout/app-footer";

const blueprintImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuADquputVL3RU4Uoc7mytUNLe9qDXKQZUJkkkG7XLsciXQTKNId6Bf8s6ov0U8SGkN1fdNS8ogXFiBQKzUU1O4RkPov9L8mxGYZ2O2U6ClqlyKJgOo7p3TQh5-CpZ1lHtzooiK91g1Cd_nodu76n7TeD3zA3MJmJTDKvtbGYr4pX0dyUPEkEAU5vWE68O3HctuRih6tH4CP2wmnzhj6ynKPE96mrIilb6ILZASyQazBe4bXGBtIgpdL8i-IE2JDn4NkxX6uKVr3MjSL";

export function OnboardingDesktopView() {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <header className="mx-auto flex w-full max-w-7xl justify-center px-8 py-10 md:justify-start">
        <h1 className="font-headline text-2xl font-extrabold tracking-tight text-primary">MoneyCheck</h1>
      </header>
      <main className="flex flex-grow items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-5xl grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-center space-y-8 p-4 lg:col-span-5 lg:p-0">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full bg-secondary-fixed px-3 py-1 text-xs font-semibold uppercase tracking-wider text-on-secondary-fixed">
                Step 01 of 03
              </span>
              <h2 className="font-headline text-4xl font-extrabold leading-tight text-primary lg:text-5xl">
                Design your <br />
                financial future.
              </h2>
              <p className="max-w-sm text-lg text-on-surface-variant">
                To curate your editorial financial intelligence dashboard, we need a few details about your current landscape.
              </p>
            </div>
            <div className="relative h-48 w-48 overflow-hidden rounded-xl bg-surface-container-high">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-10" />
              <Image src={blueprintImg} alt="" width={400} height={400} className="h-full w-full object-cover opacity-40 mix-blend-multiply" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary">architecture</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <OnboardingForm variant="desktop" />
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
