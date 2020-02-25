import {Button, hot, View, Window} from "@nodegui/react-nodegui";
import React, {MutableRefObject, useCallback, useEffect, useRef} from "react";
import {QIcon, QMainWindow, QStatusBar, WidgetEventTypes} from "@nodegui/nodegui";

import {ConnectionStatus} from "./connection/connection-status";
import mystLogo from "../assets/logo.svg";
import {Logo} from "./logo";
import {useStores} from "./store";
import {autorun} from "mobx";
import {DaemonStatusType} from "./daemon/store";
import {ConnectionStatusType} from "./connection/store";
import {Proposals} from "./proposals/proposals";

const minSize = {width: 900, height: 600};
const winIcon = new QIcon(mystLogo);

const mainWindowEventHandler = {
    [WidgetEventTypes.Close]: () => {
        process.exit()
    }
}

const statusBar = new QStatusBar()

const App = () => {
    var winRef: MutableRefObject<QMainWindow | null> = useRef<QMainWindow>(null);
    const setRef = useCallback((ref: QMainWindow) => {
        if (ref !== null) {
            ref.setStatusBar(statusBar)
        }
        winRef.current = ref
    }, [])
    const {daemon, connection, identity} = useStores();
    useEffect(() => autorun(() => {
        const daemonIcon = (daemon.status == DaemonStatusType.Up) ? '🟢' : '⚪️'
        const connectionIcon = (connection.status == ConnectionStatusType.Connected) ? '🟢' : '⚪️'
        statusBar.showMessage(`Connection: ${connectionIcon} | Daemon: ${daemonIcon} | ID: ${identity.id || '⚪'}`, 0)
    }))
    return (
        <Window
            ref={setRef}
            on={mainWindowEventHandler}
            windowIcon={winIcon}
            windowTitle="Mysterium VPN 2"
            minSize={minSize}
            maxSize={minSize}
            styleSheet={styleSheet}
        >
            <View id="main">
                <View id="left">
                    <Proposals/>
                </View>
                <View id="right">
                    <Logo/>
                    <ConnectionStatus/>
                    <View id="connect">
                        <Button id="connectBtn" text="Connect" on={{
                            ['clicked']: () => {
                            }
                        }}/>
                    </View>
                </View>
            </View>
        </Window>
    )
}

//     background-color: QLinearGradient( x1: 0, y1: 0, x2: 1, y2: 0, stop: 0 #412361, stop: 1 #9b1c4d);

const styleSheet = `
#main {
    width: ${minSize.width}px;
    height: ${minSize.height}px;
    background: "white";
    flex-direction: "row";
}
#left {
    width: 450px;
    background-color: #fafafa;
}
#right {
    flex: 1;
    align-items: "center";
    padding-top: 120px;
    background-color: #f0f0f0;
}
#connect {
    margin-top: 30px;
}
#connectBtn {
    padding: 18px;
}
`;

export default hot(App);
