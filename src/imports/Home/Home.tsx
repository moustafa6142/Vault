import svgPaths from "./svg-3xb51zsgsn";

function Clock() {
  return (
    <div className="content-stretch flex font-['SF_Pro_Display:Medium',sans-serif] items-center leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap" data-name="clock">
      <p className="relative shrink-0">9</p>
      <p className="relative shrink-0">:</p>
      <p className="relative shrink-0">41</p>
    </div>
  );
}

function Icons() {
  return (
    <div className="content-stretch flex gap-[8.5px] items-center justify-end relative shrink-0" data-name="Icons">
      <div className="h-[10px] relative shrink-0 w-[18px]" data-name="Cellular Signal">
        <div className="absolute inset-[60%_83.33%_0_0]" data-name="Bar 1">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 4">
            <path d={svgPaths.p17f47800} fill="var(--fill-0, white)" id="Bar 1" />
          </svg>
        </div>
        <div className="absolute inset-[40%_55.56%_0_27.78%]" data-name="Bar 2">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 6">
            <path d={svgPaths.p18ec7000} fill="var(--fill-0, white)" id="Bar 2" />
          </svg>
        </div>
        <div className="absolute inset-[20%_27.78%_0_55.56%]" data-name="Bar 3">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 8">
            <path d={svgPaths.p2ffd5e80} fill="var(--fill-0, white)" id="Bar 3" />
          </svg>
        </div>
        <div className="absolute inset-[0_0_0_83.33%]" data-name="Bar 4">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 10">
            <path d={svgPaths.p1cde4f80} fill="var(--fill-0, white)" id="Bar 4" />
          </svg>
        </div>
      </div>
      <div className="h-[11.619px] overflow-clip relative shrink-0 w-[16px]" data-name="Wifi">
        <div className="absolute inset-[69.84%_34.38%_-0.01%_34.32%]" data-name="Bar 1">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.00764 3.5052">
            <path d={svgPaths.p3761f300} fill="var(--fill-0, white)" id="Bar 1" />
          </svg>
        </div>
        <div className="absolute inset-[33.73%_18.68%_31.83%_18.75%]" data-name="Bar 2">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0118 4.00134">
            <path d={svgPaths.p2a184900} fill="var(--fill-0, white)" id="Bar 2" />
          </svg>
        </div>
        <div className="absolute inset-[0.01%_0.01%_56.96%_-0.02%]" data-name="Bar 3">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0014 4.99924">
            <path d={svgPaths.p296b2880} fill="var(--fill-0, white)" id="Bar 3" />
          </svg>
        </div>
      </div>
      <div className="h-[12px] overflow-clip relative shrink-0 w-[24px]" data-name="Battery">
        <div className="absolute inset-[0_12.5%_0_0]" data-name="border">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.0015 12">
            <path d={svgPaths.p26365380} fill="var(--fill-0, white)" id="border" opacity="0.4" />
          </svg>
        </div>
        <div className="absolute bg-white inset-[16.67%_20.83%_16.67%_8.33%] rounded-[1px]" data-name="indicator" />
        <div className="absolute inset-[33.33%_0_33.33%_91.67%]" data-name="cap">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
            <path d={svgPaths.p248f4800} fill="var(--fill-0, white)" id="cap" opacity="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic relative">
      <p className="font-['Poppins:SemiBold',sans-serif] relative shrink-0 text-[#e8e8f5] text-[24px] w-full">Welcome to Vault</p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[#61617f] text-[14px] w-full">Save links. Find them later.</p>
    </div>
  );
}

function LucideBellDot() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/bell-dot">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.9996 23.9999">
        <g id="lucide/bell-dot">
          <path d={svgPaths.p1800d200} id="Vector" stroke="var(--stroke-0, #9B59FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#1a1a28] content-stretch flex items-center justify-center p-[8px] relative rounded-[99px] shrink-0">
      <LucideBellDot />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[16px] top-[64px] w-[361px]">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-center leading-[normal] not-italic relative shrink-0 text-center w-full">
      <p className="font-['Poppins:Medium',sans-serif] relative shrink-0 text-[#e8e8f5] text-[18px] w-full" dir="auto">
        Your vault is empty
      </p>
      <p className="font-['Poppins:Regular',sans-serif] relative shrink-0 text-[#61617f] text-[12px] w-full">Start by saving your first link.</p>
    </div>
  );
}

function LucidePlus() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/plus">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lucide/plus">
          <path d="M5 12H19M12 5V19" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[#9b59ff] items-center justify-center p-[12px] relative rounded-[12px] shrink-0 to-[#7b69ff]">
      <LucidePlus />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-center left-[calc(25%-1.25px)] top-[397px] w-[199px]">
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function LucideHouse() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/house">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lucide/house">
          <path d={svgPaths.p27eb6300} id="Vector" stroke="var(--stroke-0, #9B59FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[rgba(155,89,255,0.15)] content-stretch flex gap-[8px] items-center justify-center px-[15px] py-[10px] relative rounded-[30px] shrink-0">
      <LucideHouse />
      <p className="font-['Poppins:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#9b59ff] text-[16px] whitespace-nowrap">Home</p>
    </div>
  );
}

function LucideLayoutGrid() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/layout-grid">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lucide/layout-grid">
          <g id="Vector">
            <path d={svgPaths.p1352c600} stroke="var(--stroke-0, #61617F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2209c100} stroke="var(--stroke-0, #61617F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p24280c70} stroke="var(--stroke-0, #61617F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.pb4bb020} stroke="var(--stroke-0, #61617F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function LucideSettings() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="lucide/settings">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="lucide/settings">
          <path d={svgPaths.p2dcd6f00} id="Vector" stroke="var(--stroke-0, #61617F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[40px] h-[44px] items-center relative shrink-0">
      <Frame6 />
      <LucideLayoutGrid />
      <LucideSettings />
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#0f0f18] relative size-full" data-name="Home">
      <div className="absolute content-stretch flex h-[48px] items-center justify-between left-0 pl-[35px] pr-[20px] py-[16px] top-0 w-[393px]" data-name="Status Bar/iOS">
        <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="Time">
          <Clock />
        </div>
        <Icons />
      </div>
      <Frame2 />
      <Frame5 />
      <div className="-translate-x-1/2 absolute bg-[#1a1a28] content-stretch flex flex-col items-center justify-center left-1/2 px-[25px] py-[20px] rounded-[40px] top-[744px] w-[331px]" data-name="Component 2">
        <Frame7 />
      </div>
    </div>
  );
}