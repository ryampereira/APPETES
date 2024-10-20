import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';

import HomeScreen from './src/screens/HomeScreen';
import CadastrosBasicosScreen from './src/screens/CadastrosBasicosScreen';
import CadastroMunicipio from './src/municipios/municipio';
import ListagemMunicipios from './src/municipios/ListagemMunicipios';
import ListagemBaciahidro from './src/baciahidrografica/ListagemBaciahidro';
import CadastroBaciaHidrografica from './src/baciahidrografica/baciahidro';
import ListagemAvaliadores from './src/avaliadorinea/ListagemAvaliador';
import CadastroAvaliador from './src/avaliadorinea/avaliadorinea'; // Importando o componente para o cadastro de avaliadores
import ListagemETEs from './src/ete/ListagemETEs';
import CadastroETE from './src/ete/ete';
import CadastroAvaliacaoIQE from './src/avaliacaoiqe/avaliacaoiqe';
import ListagemAvaliacaoIQE from './src/avaliacaoiqe/Listagemavaliacaoiqe';
import Questionario from './src/questionario/questionario';
import Dashboard from './src/dashboard';
import DashboardHistorico from './src/dashboardHistorico';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CadastrosBasicos"
            component={CadastrosBasicosScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListagemMunicipios"
            component={ListagemMunicipios}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CadastroMunicipio"
            component={CadastroMunicipio}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListagemBaciahidro"
            component={ListagemBaciahidro}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CadastroBaciaHidrografica"
            component={CadastroBaciaHidrografica}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListagemAvaliadores"
            component={ListagemAvaliadores}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CadastroAvaliador"
            component={CadastroAvaliador}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListagemETEs"
            component={ListagemETEs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CadastroETE"
            component={CadastroETE}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListagemAvaliacaoIQE"
            component={ListagemAvaliacaoIQE}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CadastroAvaliacaoIQE"
            component={CadastroAvaliacaoIQE}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Questionario"
            component={Questionario}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DashboardHistorico"
            component={DashboardHistorico}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
