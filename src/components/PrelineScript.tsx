"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PrelineScript() {
    const pathname = usePathname();

    useEffect(() => {
        const importPreline = async () => {
            // @ts-ignore
            await import("preline");
            // @ts-ignore
            window.HSStaticMethods.autoInit();
        };

        importPreline();
    }, [pathname]);

    return null;
}
