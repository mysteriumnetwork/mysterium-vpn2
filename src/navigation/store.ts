/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, observable } from "mobx"
import { History } from "history"
import { ConnectionStatus, IdentityRegistrationStatus, SSEEventType } from "mysterium-vpn-js"

import { RootStore } from "../store"
import { eventBus } from "../tequila-sse"

import { history } from "./history"

import LocationState = History.LocationState

export class NavigationStore {
    history: History<LocationState>

    @observable
    consumer = true
    @observable
    welcome = true

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        this.history = history
    }

    setupReactions(): void {
        eventBus.on(SSEEventType.AppStateChange, this.determineRoute)
    }

    @action
    showLoading = (): void => {
        this.navigateTo("/loading")
    }

    @action
    navigateTo = (path: string): void => {
        console.log("navigateTo", path)
        this.history.push(path)
    }

    @action
    determineRoute = (): void => {
        console.log("current location", this.history.location.pathname)
        const { config, identity, connection } = this.root
        if (this.history.location.pathname == "/wallet") {
            return
        }
        if (!config.currentTermsAgreed() && this.welcome) {
            this.navigateTo("/welcome")
        } else if (!config.currentTermsAgreed()) {
            this.navigateTo("/terms")
        } else if (
            !identity.identity ||
            identity.identity.registrationStatus !== IdentityRegistrationStatus.RegisteredConsumer
        ) {
            this.navigateTo("/identity")
        } else if (connection.status != ConnectionStatus.NOT_CONNECTED) {
            this.navigateTo("/connection")
        } else {
            this.navigateTo("/proposals")
        }
    }

    @action
    showWelcome = (): void => {
        this.welcome = true
    }

    @action
    dismissWelcome = (): void => {
        this.welcome = false
        this.navigateTo("/terms")
    }
}