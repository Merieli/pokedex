import CharacterTraits from '@components/CharacterTraits.vue';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { Pinia } from 'pinia';
import { createVuetify } from 'vuetify';

import { mockSelectedCharacter } from './__mocks__/mockSelectedCharacter';

import { useCharactersStore } from '@/infrastructure/store/characters';

describe('CharacterTraits.vue', () => {
    let pinia: Pinia;

    const setupWrapper = () => {
        vi.mock('@/infrastructure/gateway/CharactersGatewayHttp');

        pinia = createTestingPinia({
            initialState: {
                characters: {
                    pagination: {
                        currentPage: 1,
                        total: 1,
                        results: 10,
                    },
                    selectedCharacter: mockSelectedCharacter,
                },
            },
        });

        const vuetify = createVuetify();

        return {
            wrapper: mount(CharacterTraits, {
                global: {
                    plugins: [pinia, vuetify],
                    stubs: {
                        teleport: true,
                    },
                },
            }),
            store: useCharactersStore(),
        };
    };

    describe('Integração/Componente', () => {
        describe('👀 Renderização:', () => {
            test('Dado o componente Quando renderizado Então deve possuir html equivalente ao Snapshot gravado', () => {
                const { wrapper } = setupWrapper();

                expect(wrapper.html()).toMatchSnapshot();
            });

            test('Dado uma lista de características do personagem Quando renderizado Então deve exibir o nome e id do personagem', () => {
                const { wrapper } = setupWrapper();
                const characterName = wrapper.find('[data-character-traits="name"]');
                const characterId = wrapper.find('[data-character-traits="id"]');

                expect(characterName.text()).toBe(mockSelectedCharacter.name);
                expect(characterId.text()).toBe(`# ${mockSelectedCharacter.id}`);
            });

            test('Dado uma lista de caraterísticas do personagem Quando renderizado Então deve exibir as tags de espécie e estado de vida', () => {
                const { wrapper } = setupWrapper();
                const characterSpecie = wrapper.find('[data-character-traits="specie"]');
                const characterStatus = wrapper.find('[data-character-traits="status"]');

                expect(characterSpecie.text()).toBe(mockSelectedCharacter.species);
                expect(characterStatus.text()).toBe(mockSelectedCharacter.status);
            });

            test('Dado uma lista de caraterísticas do personagem Quando renderizado Então deve exibir nas abas os dados da localização do personagem', () => {
                const { wrapper } = setupWrapper();
                const location = wrapper.find('[data-character-traits="location"]');

                expect(location.exists()).toBeTruthy();
            });

            test('Dado uma lista de caraterísticas do personagem Quando renderizado Então deve exibir nas abas os dados do último episódio com o personagem', () => {
                const { wrapper } = setupWrapper();
                const location = wrapper.find('[data-character-traits="last-episode"]');

                expect(location.exists()).toBeTruthy();
            });
        });
        // describe('🧠 Comportamento:', ()=> {

        // })
        // describe('🐕 Navegação:', ()=> {

        // })
    });
});
