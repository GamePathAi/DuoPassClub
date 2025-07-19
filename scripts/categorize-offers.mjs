import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL ou Key não encontradas. Verifique seu arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function categorizeOffers() {
  console.log('Iniciando a categorização de ofertas...');

  try {
    const { data: offers, error } = await supabase
      .from('offers')
      .select('id, category, title, original_value');

    if (error) {
      console.error('Erro ao buscar ofertas:', error.message);
      return;
    }

    if (!offers || offers.length === 0) {
      console.log('Nenhuma oferta encontrada para categorizar.');
      return;
    }

    console.log(`Encontradas ${offers.length} ofertas para processar.`);

    const updates = offers.map(offer => {
      let tier = 'Freemium'; // Padrão

      // Lógica de categorização (exemplo)
      if (offer.category.toLowerCase().includes('gourmet') || offer.original_value > 100) {
        tier = 'Premium';
      } 
      if (offer.title.toLowerCase().includes('exclusivo') || offer.title.toLowerCase().includes('vip')) {
        tier = 'Golden';
      }

      return supabase
        .from('offers')
        .update({ tier: tier })
        .eq('id', offer.id);
    });

    const results = await Promise.all(updates);

    let successCount = 0;
    results.forEach((result, index) => {
      if (result.error) {
        console.error(`Erro ao atualizar a oferta ${offers[index].id}:`, result.error.message);
      } else {
        successCount++;
      }
    });

    console.log(`
Processo concluído!
${successCount} de ${offers.length} ofertas foram atualizadas com sucesso.`);

  } catch (err) {
    console.error('Ocorreu um erro inesperado durante o processo:', err);
  }
}

categorizeOffers();