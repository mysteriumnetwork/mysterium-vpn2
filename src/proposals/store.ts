import {action, computed, observable, reaction} from "mobx";
import {RootStore} from "../store";
import {DaemonStatusType} from "../daemon/store";
import tequilapi from "../tequila";
import {Proposal} from "mysterium-vpn-js";
import * as _ from "lodash";

export class ProposalStore {
    @observable
    loading = false
    @observable
    proposals: Proposal[] = []
    @observable
    active?: Proposal

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions() {
        reaction(() => this.root.daemon.status, async (status) => {
            if (status == DaemonStatusType.Up) {
                await this.fetchProposals()
            }
        })
    }

    @action
    async fetchProposals() {
        this.loading = true
        try {
            this.proposals = await tequilapi.findProposals()
        } catch (err) {
            console.log("Could not get proposals", err)
        }
        this.loading = false
    }

    @computed
    get byCountry() {
        return _.groupBy(this.proposals, p => p.serviceDefinition?.locationOriginate?.country)
    }

    set activate(proposal: Proposal) {
        console.info("Selected proposal", JSON.stringify(proposal))
        this.active = proposal
    }

}