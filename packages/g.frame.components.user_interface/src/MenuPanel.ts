import { ActionController, ActionControllerEventName } from "@g.frame/common.action_controller";
import { AUDIO, Loader, TEXTURE } from "@g.frame/common.loaders";
import { ModulesProcessor, ViewerModule } from "@g.frame/core";
import { Euler, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Texture, Vector3 } from "three";

export interface IMC {
    position: Vector3;
    rotation: Euler;
    scale: number;
    vr_position: Vector3;
    vr_rotation: Euler;
    vr_scale: number;
}

export default class MenuPanel extends ViewerModule {
    private actionController: ActionController;
    private loader: Loader<any>;

    public mainContainer: Group = new Group;
    private mainThemeMuted: boolean = false;
    private voicesMuted: boolean = false;

    private muteButton: Mesh;
    private muteButton_active: Mesh;
    private voiceMuteButton: Mesh;
    private voiceMuteButton_active: Mesh;
    private exitExperienceButton: Mesh;

    private mainTheme: HTMLAudioElement;

    constructor(private modulesProcessor: ModulesProcessor) {
        super();

        modulesProcessor.agents.get(Loader).addResources([
            {
                name: 'TEXTURE_exit_button',
                url: require('../../assets/textures/menu_buttons/exit_button.png'),
                type: TEXTURE,
            },
            {
                name: 'TEXTURE_mute_button',
                url: require('../../assets/textures/menu_buttons/mute_button.png'),
                type: TEXTURE,
            },
            {
                name: 'TEXTURE_mute_button_active',
                url: require('../../assets/textures/menu_buttons/mute_button_active.png'),
                type: TEXTURE,
            },
            {
                name: 'TEXTURE_voice_mute_button',
                url: require('../../assets/textures/menu_buttons/voice_mute_button.png'),
                type: TEXTURE,
            },
            {
                name: 'TEXTURE_voice_mute_button_active',
                url: require('../../assets/textures/menu_buttons/voice_mute_button_active.png'),
                type: TEXTURE,
            },
            {
                name: 'MUSIC_background_theme',
                url: require('../../assets/audio/background_music.mp3'),
                type: AUDIO,
            },
        ]);

        this.actionController = this.modulesProcessor.agents.get(ActionController);
        this.loader = this.loader;
    }

    init() {
        this.mainTheme = this.loader.getResource<HTMLAudioElement>('MUSIC_background_theme');
        this.mainTheme.volume = 0.35;
        this.mainTheme.loop = true;

        //ui
        this.mainContainer.name = 'Menu Container';
        this.mainContainer.position.set(3, 2.5, 0);        

        this.voiceMuteButton = new Mesh(new PlaneGeometry(.6, .6), new MeshBasicMaterial({
            map: this.loader.getResource<Texture>('TEXTURE_voice_mute_button'),
            transparent: true
        }));
        this.voiceMuteButton_active = new Mesh(new PlaneGeometry(.6, .6), new MeshBasicMaterial({
            map: this.loader.getResource<Texture>('TEXTURE_voice_mute_button_active'),
            transparent: true
        }))

        this.voiceMuteButton.position.set(-1.9, 0, 0);

        this.voiceMuteButton_active.position.set(-1.9, 0, 0);
        this.voiceMuteButton_active.visible = false;

        this.mainContainer.add(this.voiceMuteButton);
        this.mainContainer.add(this.voiceMuteButton_active);
    
        this.actionController.on(ActionControllerEventName.click, this.voiceMuteButton, (event) => {
            if (event.data.intersection.orderNumber !== 0) return;
            this.toggleVoices(true);
        });

        this.actionController.on(ActionControllerEventName.click, this.voiceMuteButton_active, (event) => {
            if (event.data.intersection.orderNumber !== 0) return;
            this.toggleVoices(false);
        });

        //
        
        this.muteButton = new Mesh(new PlaneGeometry(.6, .6), new MeshBasicMaterial({
            map: this.loader.getResource<Texture>('TEXTURE_mute_button'),
            transparent: true
        }));

        this.muteButton_active = new Mesh(new PlaneGeometry(.6, .6), new MeshBasicMaterial({
            map: this.loader.getResource<Texture>('TEXTURE_mute_button_active'),
            transparent: true
        }));

        this.mainContainer.add(this.muteButton);
        this.mainContainer.add(this.muteButton_active);

        this.muteButton.position.set(-1.2, 0, 0);

        this.muteButton_active.position.set(-1.2, 0, 0);
        this.muteButton_active.visible = false;
    
        this.actionController.on(ActionControllerEventName.click, this.muteButton, (event) => {
            if (event.data.intersection.orderNumber !== 0) return;
            this.toggleMainTheme(true);
        });

        this.actionController.on(ActionControllerEventName.click, this.muteButton_active, (event) => {
            if (event.data.intersection.orderNumber !== 0) return;
            this.toggleMainTheme(false);
        });

        this.mainContainer.add(this.exitExperienceButton = new Mesh(new PlaneGeometry(1.5, .6), new MeshBasicMaterial({
            map: this.loader.getResource<Texture>('TEXTURE_exit_button'),
            transparent: true
        })));
        this.exitExperienceButton.visible = true;
        this.exitExperienceButton.position.set(0, 0, 0 );
    
        this.actionController.on(ActionControllerEventName.click, this.exitExperienceButton, () => {
            this.exitExperience();
        });

    }

    exitExperience() {
        window.close();
    }

    toggleMainTheme(mode: boolean) {
        this.mainThemeMuted = mode;
        this.mainTheme.muted = this.mainThemeMuted;

        this.muteButton.visible = !this.mainThemeMuted;
        this.muteButton_active.visible = this.mainThemeMuted;
    }

    toggleVoices(mode: boolean) {
        this.voicesMuted = mode;
        this.voiceMuteButton.visible = !this.voicesMuted;
        this.voiceMuteButton_active.visible = this.voicesMuted;

        //@ts-ignore
        this.loader.loaders[0].library.forEach(audio => audio.muted = this.voicesMuted);
        this.mainTheme.muted = this.mainThemeMuted;
    }

    playMusic() {
        this.mainTheme.play();
    }

    updatePosition(menuConfig: IMC) {
        this.mainContainer.position.copy(menuConfig.position);
        this.mainContainer.rotation.copy(menuConfig.rotation);
        this.mainContainer.scale.setScalar(menuConfig.scale);
        this.show();
    }

    hide() {
        this.mainContainer.visible = false;
    }

    show() {
        this.mainContainer.visible = true;
    }
}