/**
 * Resource & Carousel Categorization System
 * Centralized mapping and categorization logic for visual guides and slide decks
 */

export const RESOURCE_CATEGORIES = [
  'Python',
  'Data Analytics',
  'Power BI',
  'SQL & Databases',
  'Machine Learning',
  'Deep Learning',
  'Generative AI',
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

/**
 * Curated mapping for all resource slugs to ensure 100% accurate classification
 */
export const RESOURCE_CATEGORY_MAP: Record<string, ResourceCategory> = {
  // Python (2 items)
  'Supercharge_Your_Data_Analysis_with_Python': 'Python',
  "Unlock_Your_Data's_Potential_with_Python": 'Python',

  // Data Analytics (12 items)
  'VLOOKUP_vs_XLOOKUP_Key_Differences': 'Data Analytics',
  "Your_Data's_Best_Friend_Excel_or_Power_BI": 'Data Analytics',
  'Your_Data_Dilemma_Spreadsheet_or_Database': 'Data Analytics',
  'Master_Your_Data_With_These_5_Essential_Charts': 'Data Analytics',
  'See_Your_Data,_Tell_Your_Story': 'Data Analytics',
  'Your_Data_Is_Only_as_Good_as_How_It_Looks': 'Data Analytics',
  'Is_Your_Data_Holding_You_Back_Clean_It_Up': 'Data Analytics',
  'Is_Your_Data_Telling_the_Whole_Story': 'Data Analytics',
  'Your_Data_Workflow_Is_Costing_You_Time': 'Data Analytics',
  "Your_Raw_Data's_Makeover_Starts_Here": 'Data Analytics',
  'Master_Your_Next_Data_Analyst_Interview': 'Data Analytics',
  'Nail_Your_Next_Data_Analyst_Interview': 'Data Analytics',

  // Power BI (21 items)
  '5_ways_to_avoid_data_model_issues_in_Power_BI': 'Power BI',
  'Is_Your_DAX_Slow_Fix_It_Outside_Power_BI': 'Power BI',
  'Is_Your_Power_BI_Report_Slow_Fix_This_First': 'Power BI',
  'Is_Your_Report_Slowing_You_Down': 'Power BI',
  'Mix_Data_Modes_Without_Slowing_Down_Power_BI': 'Power BI',
  'Secure_Your_Data_Without_Slowing_Down': 'Power BI',
  'Stop_Doing_Power_BI_Chores_Manually': 'Power BI',
  'Stop_Refreshing_Your_Entire_Giant_Dataset': 'Power BI',
  'Stop_Repeating_Your_Data_Work': 'Power BI',
  'The_Unseen_Hurdles_of_Power_BI': 'Power BI',
  'Tired_of_Repeating_Your_DAX_Code': 'Power BI',
  'Top_10_Concepts_You_Must_Know_in_Power_BI': 'Power BI',
  'Unlock_Faster_Power_BI_Performance_Now!': 'Power BI',
  'Unlock_Interactive_Storytelling_in_Power_BI': 'Power BI',
  'Unlock_the_Magic_of_Interactive_Power_BI_Reports': 'Power BI',
  "Unlock_Your_Data's_True_Potential": 'Power BI',
  'Who_Can_See_Your_Power_BI_Data_Access_Demystified': 'Power BI',
  "Your_Power_BI_Data_is_a_Mess._Let's_Fix_It": 'Power BI',
  'Your_Power_BI_Report_is_Only_as_Good_as_Its_Data_Model': 'Power BI',
  'Your_Power_BI_Report_is_Ready._Now_What': 'Power BI',
  'Your_Power_BI_Success_Starts_With_Governance': 'Power BI',

  // SQL & Databases (14 items)
  'Ace_Your_Next_Data_Analyst_Interview_With_SQL': 'SQL & Databases',
  'Database_Keys_Explained_The_Superheroes_of_Data': 'SQL & Databases',
  'SQL_Joins_Made_Simple_Your_Party_Guest_List': 'SQL & Databases',
  'Stop_Guessing,_Start_Querying_Your_Data_Awaits': 'SQL & Databases',
  "Stop_Guessing._Master_Your_Data's_Timeline": 'SQL & Databases',
  'Stop_Guessing._Start_Measuring_with_SQL': 'SQL & Databases',
  'Stop_Writing_Complex_Queries._Master_These_Instead': 'SQL & Databases',
  'Tame_Your_Text_Data_with_SQL': 'SQL & Databases',
  "The_Secret_to_Unlocking_Your_Data's_Full_Story": 'SQL & Databases',
  'Unlock_the_Secret_Weapon_of_SQL_Pros': 'SQL & Databases',
  "Your_Data's_Missing_a_Superhero._Meet_Composite_Keys": 'SQL & Databases',
  "Your_Data's_Temporary_Toolkit_Explained": 'SQL & Databases',
  'Your_Data_is_a_Mess._Let_SQL_Fix_It': 'SQL & Databases',
  "Your_SQL_Doesn't_Have_to_Be_a_Mess": 'SQL & Databases',

  // Generative AI (7 items)
  'Beyond_the_Buzzwords_AI,_ML_&_Data_Science_Explained': 'Generative AI',
  'How_RAG_Works_And_Why_It_Matters': 'Generative AI',
  'Surviving_the_Inevitable_AI_Market_Correction': 'Generative AI',
  'TOON_vs_JSON_-_The_Data_Format_Battle': 'Generative AI',
  'Tools_and_Tool_Calling_in_Agentic_AI': 'Generative AI',
  'Types_of_RAG': 'Generative AI',
  'Understanding_RAG_And_Why_It_Matters': 'Generative AI',

  // Deep Learning (3 items)
  'Unlock_Power_with_Transfer_Learning': 'Deep Learning',
  'Understanding_Reinforcement_Learning': 'Deep Learning',
  'Markov_Decisions,_Powerful_RL_Tools': 'Deep Learning',

  // Machine Learning (37 items)
  'Bagging_vs_Boosting_Explained': 'Machine Learning',
  'Beyond_One_Split_Mastering_Cross-Validation': 'Machine Learning',
  'Bias_&_Variance_The_ML_Balancing_Act': 'Machine Learning',
  'Building_with_Data_A_Machine_Learning_Journey': 'Machine Learning',
  'Cleaning_Data_Feature_Selection_for_Better_Models': 'Machine Learning',
  'Decision_Trees_—_How_Machines_Split_Decisions_Like_Humans': 'Machine Learning',
  'Deconstructing_The_Machine_Learning_Magic': 'Machine Learning',
  "Facing_Data's_High_Dimensionality": 'Machine Learning',
  'Garbage_In,_Garbage_Out_The_Power_of_Data_Preprocessing': 'Machine Learning',
  'Gradient_Boosting_The_Supermodel_of_Machine_Learning': 'Machine Learning',
  'Grid_Search_vs_Random_Search_Optimizing_Models': 'Machine Learning',
  'How_Machines_Actually_Learn_A_Simple_Guide': 'Machine Learning',
  'Improve_Predictions_The_Power_of_Model_Stacking': 'Machine Learning',
  'Is_Your_Model_Learning_or_Just_Memorizing': 'Machine Learning',
  'K-Means_Clustering_Explained_Simply': 'Machine Learning',
  'K-Nearest_Neighbors_-_Learning_by_Proximity': 'Machine Learning',
  'Level_Up_Your_Models_Feature_Engineering_Power': 'Machine Learning',
  'Linear_Regression_Explained_Simply_With_Real_Estate': 'Machine Learning',
  "Logistic_Regression_It's_Not_What_You_Think": 'Machine Learning',
  'Machine_Learning_vs._Traditional_Programming_A_New_Paradigm': 'Machine Learning',
  'Master_the_Confusion_Matrix': 'Machine Learning',
  'Mastering_Hyperparameter_Tuning': 'Machine Learning',
  'Mastering_Regression_Metrics': 'Machine Learning',
  'Naive_Bayes_The_Simple_Genius_of_Text_Classification': 'Machine Learning',
  'PCA_Unlocking_Hidden_Patterns_in_Your_Data': 'Machine Learning',
  'Prevent_Overfitting_with_Regularization': 'Machine Learning',
  'Random_Forests_—_the_power_of_multiple_decision_trees': 'Machine Learning',
  'Spotting_the_Unusual_Anomaly_Detection_Explained': 'Machine Learning',
  'Support_Vector_Machines_—_The_Art_of_Perfect_Separation': 'Machine Learning',
  "Training_vs_Testing_Data_ML's_Secret_Sauce": 'Machine Learning',
  'Understanding_Classification_Evaluation_Metrics': 'Machine Learning',
  'Understanding_Prediction_Performance_ROC_&_AUC': 'Machine Learning',
  'Unlock_the_Past,_Predict_the_Future': 'Machine Learning',
  'Why_Feature_Scaling_Matters': 'Machine Learning',
  'Wisdom_of_the_Crowd_in_ML': 'Machine Learning',
  'Your_Brain_Learns_Three_Ways._So_Do_Machines': 'Machine Learning',
  "Your_Phone_Already_Knows._It's_Machine_Learning": 'Machine Learning',
};

/**
 * Determine category for a resource with explicit dictionary lookup + heuristic fallback
 */
export function getResourceCategory(slug: string, title?: string, postText?: string): ResourceCategory {
  if (RESOURCE_CATEGORY_MAP[slug]) {
    return RESOURCE_CATEGORY_MAP[slug];
  }

  const combined = `${slug} ${title || ''} ${postText || ''}`.toLowerCase();

  // Python
  if (
    combined.includes('supercharge_your_data_analysis_with_python') ||
    combined.includes('unlock_your_data\'s_potential_with_python') ||
    (combined.includes('python') && !combined.includes('power bi') && !combined.includes('sql') && !combined.includes('machine learning'))
  ) {
    return 'Python';
  }

  // Data Analytics (Excel, Visuals, Cleaning, Workflows)
  if (
    combined.includes('vlookup') ||
    combined.includes('xlookup') ||
    combined.includes('spreadsheet') ||
    combined.includes('chart') ||
    combined.includes('storytelling') ||
    combined.includes('data analyst') ||
    combined.includes('data workflow')
  ) {
    return 'Data Analytics';
  }

  // Power BI
  if (
    combined.includes('power bi') ||
    combined.includes('power_bi') ||
    combined.includes('dax') ||
    combined.includes('power query') ||
    combined.includes('dataflow') ||
    combined.includes('query folding') ||
    combined.includes('rls') ||
    combined.includes('calculate')
  ) {
    return 'Power BI';
  }

  // SQL & Databases
  if (
    combined.includes('sql') ||
    combined.includes('database') ||
    combined.includes('join') ||
    combined.includes('cte') ||
    combined.includes('temporary table') ||
    combined.includes('window function') ||
    combined.includes('foreign key') ||
    combined.includes('primary key') ||
    combined.includes('composite key')
  ) {
    return 'SQL & Databases';
  }

  // Deep Learning & RL
  if (
    combined.includes('transfer learning') ||
    combined.includes('deep learning') ||
    combined.includes('neural network') ||
    combined.includes('reinforcement learning') ||
    combined.includes('markov') ||
    combined.includes('cnn') ||
    combined.includes('rnn') ||
    combined.includes('transformer') ||
    combined.includes('pytorch') ||
    combined.includes('tensorflow')
  ) {
    return 'Deep Learning';
  }

  // Generative AI
  if (
    combined.includes('agentic') ||
    combined.includes('rag') ||
    combined.includes('retrieval') ||
    combined.includes('llm') ||
    combined.includes('prompt') ||
    combined.includes('generative ai') ||
    combined.includes('genai') ||
    combined.includes('toon') ||
    combined.includes('tool calling') ||
    combined.includes('artificial intelligence')
  ) {
    return 'Generative AI';
  }

  // Machine Learning (default fallback)
  return 'Machine Learning';
}

/**
 * Get all categories formatted for UI tabs
 */
export function getResourceCategoriesList(): string[] {
  return ['All', ...RESOURCE_CATEGORIES];
}
