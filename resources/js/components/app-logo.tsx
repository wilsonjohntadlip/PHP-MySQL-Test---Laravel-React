import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-lg font-extrabold tracking-wide text-white dark:text-black">OP</span>
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="truncate leading-tight font-extrabold tracking-wide text-gray-800 dark:text-white text-lg">Ossteq Phils</span>
            </div>
        </>
    );
}
