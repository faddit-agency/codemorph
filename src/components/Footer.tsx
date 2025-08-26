import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 mt-16 relative z-30 bg-white">
      <div className="w-full max-w-none px-8 md:px-16 py-16 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div className="space-y-3">
          <div className="mb-4">
            <Image
              src="/logo_0826.svg"
              alt="CODEMORPH"
              width={120}
              height={24}
              className="h-6"
            />
          </div>
          <p className="text-black/60 max-w-xs">
            Minimal retail experience inspired by Our Legacy. This is a demo UI.
          </p>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Contact</div>
          <div className="flex flex-col space-y-1">
            <Link href="#" className="hover:underline block">
              Shipping & Return
            </Link>
            <Link href="#" className="hover:underline block">
              FAQ
            </Link>
            <Link href="#" className="hover:underline block">
              Careers
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Legal</div>
          <div className="flex flex-col space-y-1">
            <Link href="#" className="hover:underline block">
              Terms & Conditions
            </Link>
            <Link href="#" className="hover:underline block">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline block">
              Cookie Policy
            </Link>
          </div>
        </div>
        <form className="space-y-3">
          <label className="block font-medium">Newsletter</label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="border border-black/15 px-3 py-2 w-full"
            />
            <button type="submit" className="border px-4 py-2">
              Join
            </button>
          </div>
          <p className="text-xs text-black/60">
            By subscribing you agree to our privacy policy.
          </p>
        </form>
      </div>
    </footer>
  );
}


