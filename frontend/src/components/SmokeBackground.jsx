// Atmospheric "smoke" backdrop for the admin login screen: a few large,
// heavily-blurred, softly-drifting grayscale blobs over a near-black base.
// Pure CSS — no video/canvas/WebGL dependency, so it stays lightweight.
export default function SmokeBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050505]">
            <style>{`
          /* ── existing drift (keep as-is) ── */
          @keyframes drift {
            0%   { transform: translate(0, 0) scale(1); }
            25%  { transform: translate(30px, -15px) scale(1.02); }
            50%  { transform: translate(-20px, 10px) scale(0.98); }
            75%  { transform: translate(15px, 25px) scale(1.01); }
            100% { transform: translate(0, 0) scale(1); }
          }

          /* ── new: slow pulse + float ── */
          @keyframes float-pulse {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
            33%      { transform: translate(25px, -30px) scale(1.15); opacity: 0.85; }
            66%      { transform: translate(-15px, 20px) scale(0.9); opacity: 0.6; }
          }

          /* ── new: sway with rotation ── */
          @keyframes sway-rotate {
            0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
            50%      { transform: translate(-35px, 10px) rotate(4deg) scale(1.08); }
          }

          /* ── new: wide, slow figure-8 ── */
          @keyframes figure-eight {
            0%   { transform: translate(0, 0) scale(1); }
            25%  { transform: translate(40px, -25px) scale(1.05); }
            50%  { transform: translate(0, -40px) scale(0.95); }
            75%  { transform: translate(-40px, 25px) scale(1.05); }
            100% { transform: translate(0, 0) scale(1); }
          }

          /* ── new: gentle breathing (minimal movement, max pulse) ── */
          @keyframes breathe {
            0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.3; }
            50%      { transform: scale(1.2) translate(10px, -5px); opacity: 0.7; }
          }

          /* ── new: diagonal drift ── */
          @keyframes diagonal-drift {
            0%, 100% { transform: translate(0, 0); }
            50%      { transform: translate(45px, 35px); }
          }

          .animate-drift          { animation: drift 18s ease-in-out infinite; }
          .animate-float-pulse    { animation: float-pulse 14s ease-in-out infinite; }
          .animate-sway-rotate    { animation: sway-rotate 16s ease-in-out infinite; }
          .animate-figure-eight   { animation: figure-eight 22s ease-in-out infinite; }
          .animate-breathe        { animation: breathe 12s ease-in-out infinite; }
          .animate-diagonal-drift { animation: diagonal-drift 20s ease-in-out infinite; }
        `}</style>

            {/* ── existing blobs (keep as-is) ── */}
            <div className="absolute left-1/4 top-1/3 h-[34rem] w-[34rem] animate-drift rounded-full bg-white/[0.09] blur-[1010px]" />

            <div
                className="absolute right-1/4 top-1/4 h-[88rem] w-[88rem] animate-drift rounded-full bg-primary-600/40 blur-[1010px]"
                style={{ animationDelay: '-6s', animationDuration: '12s' }}
            />

            <div
                className="absolute bottom-0 left-1/2 h-[80rem] w-[80rem] -translate-x-1/2 animate-drift rounded-full bg-white/[0.07] blur-[120px]"
                style={{ animationDelay: '-12s', animationDuration: '12s' }}
            />

            {/* ── new: extra animated blobs ── */}
            <div
                className="absolute right-[10%] top-[55%] h-[50rem] w-[50rem] animate-float-pulse rounded-full bg-white/[0.06] blur-[160px]"
                style={{ animationDelay: '-3s' }}
            />

            <div
                className="absolute left-[5%] top-[70%] h-[40rem] w-[40rem] animate-sway-rotate rounded-full bg-primary-500/20 blur-[140px]"
                style={{ animationDelay: '-8s', animationDuration: '12s' }}
            />

            <div
                className="absolute left-[40%] top-[5%] h-[60rem] w-[60rem] animate-figure-eight rounded-full bg-white/[0.05] blur-[200px]"
                style={{ animationDelay: '-15s' }}
            />

            <div
                className="absolute right-[30%] bottom-[10%] h-[30rem] w-[30rem] animate-breathe rounded-full bg-white/[0.08] blur-[100px]"
                style={{ animationDelay: '-5s', animationDuration: '12s' }}
            />

            <div
                className="absolute left-[55%] top-[45%] h-[45rem] w-[45rem] animate-diagonal-drift rounded-full bg-primary-400/15 blur-[180px]"
                style={{ animationDelay: '-10s', animationDuration: '12s' }}
            />

            {/* ── gradient overlay (keep as-is) ── */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/70" />
        </div>
    );
}