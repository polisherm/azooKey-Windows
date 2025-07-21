import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCcw, ExternalLink, Keyboard } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { invoke } from '@tauri-apps/api/core';

export const General = () => {
    const [keyBindings, setKeyBindings] = useState({
        enable_muhenkan_henkan: true,
    });

    // Load config on component mount
    useEffect(() => {
        invoke<any>("get_config")
            .then((data) => {
                const keyBindings = data.key_bindings;
                setKeyBindings({
                    enable_muhenkan_henkan: keyBindings.enable_muhenkan_henkan,
                });
            })
            .catch(() => {
                // Keep default values if config fetch fails
            });
    }, []);

    const updateConfig = async (updater: (config: any) => void) => {
        try {
            const data = await invoke<any>("get_config");
            updater(data);
            await invoke("update_config", { newConfig: data });
            return data;
        } catch (error) {
            toast("設定の更新に失敗しました");
            return null;
        }
    };

    const handleMuhenkanHenkanChange = async () => {
        const data = await updateConfig((data) => {
            data.key_bindings.enable_muhenkan_henkan = !keyBindings.enable_muhenkan_henkan;
        });
        
        if (data) {
            setKeyBindings((prev) => ({ 
                ...prev, 
                enable_muhenkan_henkan: data.key_bindings.enable_muhenkan_henkan 
            }));
            toast("キーバインド設定が更新されました");
        }
    };

    return (
        <div className="space-y-8">
            <section className="space-y-2">
                <h1 className="text-sm font-bold text-foreground">キーバインド</h1>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Keyboard />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            無変換・変換キーでIME切り替え
                        </p>
                        <p className="text-xs text-muted-foreground">
                            無変換キー（IMEオフ）と変換キー（IMEオン）でも入力モードを切り替えられるようにします
                        </p>
                    </div>
                    <Switch 
                        checked={keyBindings.enable_muhenkan_henkan} 
                        onCheckedChange={handleMuhenkanHenkanChange} 
                    />
                </div>
            </section>
            <section className="space-y-2">
                <h1 className="text-sm font-bold text-foreground">バージョンと更新プログラム</h1>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <RefreshCcw />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            v0.1.0-alpha.1
                        </p>
                    </div>
                    <Button  variant="secondary">
                        <a href="https://github.com/fkunn1326/azooKey-Windows/releases" className="flex items-center gap-x-2" target="_blank" rel="noopener noreferrer">
                            <ExternalLink />
                            更新を確認する
                        </a>
                    </Button>
                </div>
            </section>
            {/* <section className="space-y-2">
                <h1 className="text-sm font-bold text-foreground">診断とフィードバック</h1>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <FileChartColumn />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            診断データ
                        </p>
                        <p className="text-xs text-muted-foreground">
                            診断データを保存し、バグの修正に役立てます
                        </p>
                    </div>
                    <Switch />
                </div>
            </section> */}
        </div>
    )
}