import { nextTick } from 'vue';

import CharacterList from '@components/CharacterList.vue';
import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { mockListOfCharactersInSearch, mockStoreCharacters } from './__mocks__/mockStoreCharacters';

import { useCharactersStore } from '@/infrastructure/store/characters';

describe('CharacterList.vue', () => {
    let pinia: any;

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
                    charactersPerPage: mockStoreCharacters,
                    random: {
                        character: [
                            {
                                id: 3,
                                name: 'Jerry Smith',
                                image: 'https://image.com/jerry.png',
                                status: 'live',
                                gender: 'Male',
                                species: 'Human',
                            },
                        ],
                    },
                    search: {
                        characters: [],
                    },
                },
            },
        });
        const vuetify = createVuetify();

        return {
            wrapper: mount(CharacterList, {
                global: {
                    plugins: [pinia, vuetify],
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

            test('Dado uma lista de personagens Quando renderizada Então deve mostrar a quantidade total de resultados encontrados em todas as páginas', () => {
                const { wrapper } = setupWrapper();
                const qtd = wrapper.find('[data-list="results"]');
                const totalOfCharacters = 10;

                expect(qtd.text()).toBe(`${totalOfCharacters} results`);
            });

            test('Dado uma lista de personagens Quando renderizada Então deve mostrar o card de personagens na quantidade correta', () => {
                const { wrapper } = setupWrapper();
                const qtd = wrapper.findAll('[data-list="card"]');

                expect(qtd).toHaveLength(4);
            });

            test('Dado uma lista de personagens Quando renderizada Então deve exibir um botão para carregar mais personagens', () => {
                const { wrapper } = setupWrapper();
                const loadPage = wrapper.findAll('[data-list="pagination"]');

                expect(loadPage).toHaveLength(1);
            });
        });
        describe('🧠 Comportamento:', () => {
            test('Dado a lista de personagens Quando montado o componente Então deve chamar a action para buscar todos os pesonagens', () => {
                const { store } = setupWrapper();

                expect(store.getAllCharacters).toHaveBeenCalledTimes(1);
            });

            test('Dado uma paginação Quando clicada em uma página Então deve chamar a action para buscar mais personagens da próxima página', async () => {
                const { wrapper, store } = setupWrapper();
                const loadPage = wrapper.find('[data-list="pagination"]');

                await loadPage.trigger('click');

                expect(store.getAllCharacters).toHaveBeenCalledTimes(1);
            });

            test('Dado uma lista de personagens Quando buscar por algum personagem em específico Então deve trocar os personagens visíveis pelos encontrados na store', async () => {
                const { wrapper, store } = setupWrapper();
                store.search.characters = mockListOfCharactersInSearch;
                await nextTick();
                const cards = wrapper.findAll('[data-list="card"]');
                const names = wrapper.findAll('[data-character="name"]');

                expect(cards).toHaveLength(2);
                expect(names[0].text()).toBe(mockListOfCharactersInSearch[0].name);
                expect(names[1].text()).toBe(mockListOfCharactersInSearch[1].name);
            });

            test('Dado o resultado ao gerar um personagem aleatório Quando clicar para limpar e exibir a lista Então deve exibir a lista com todos personagens na quantidade correta novamente', async () => {
                const { wrapper, store } = setupWrapper();
                store.random.show = true;
                await nextTick();
                const buttonClearRandom = wrapper.find('[data-list="clear-random-button"]');

                await buttonClearRandom.trigger('click');

                const characters = wrapper.findAll('[data-list="card"]');

                expect(characters).toHaveLength(4);
            });

            test('Dado o resultado de uma pesquisa Quando clicar para limpar e exibir a lista Então deve chamar o método responsável por limpar os valores de search na store', async () => {
                const { wrapper, store } = setupWrapper();
                store.search.characters = mockListOfCharactersInSearch;
                await nextTick();
                const buttonClearSearch = wrapper.find('[data-list="clear-search-button"]');

                await buttonClearSearch.trigger('click');

                const characters = wrapper.findAll('[data-list="card"]');

                expect(characters).toHaveLength(4);
            });
        });
    });
});
